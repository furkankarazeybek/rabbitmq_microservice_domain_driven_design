import amqp from 'amqplib';
import { ProductServiceHandler } from './application/product';
import { inject, injectable } from 'inversify';
import { TYPES } from './types';

const RABBITMQ_URL = 'amqp://localhost';

@injectable()
export class MessageListener {
    private channel!: amqp.Channel;
    private productServiceHandler: ProductServiceHandler;
  
    constructor(
      @inject(TYPES.ProductServiceHandler) productServiceHandler: ProductServiceHandler
    ) {
      this.productServiceHandler = productServiceHandler;
    }
  

  async start() {
    console.log("Message listener started");
    const connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await connection.createChannel();  

    await this.channel.assertQueue('product.getProductList', { durable: false });
    await this.channel.assertQueue('product.getProductCategoriesList', { durable: false });

    this.channel.consume('product.getProductList', async (msg) => {
        console.log("GETPRODUCTLIST KUYRUĞU DİNLENİYOR");
      if (msg !== null) {
        try {
          const parsedMessage = JSON.parse(msg.content.toString());
          console.log("Received message for product.getProductList:", parsedMessage);

          const correlationId = parsedMessage.correlationId;
          console.log("corelation ıd", correlationId);

          const products = await this.productServiceHandler.getProductList();
          console.log("Products list from getProductList:", products);

          parsedMessage.routeIndex++;

          const response = {
            ...parsedMessage,
            resultStack: {
              getProductListResult: products
            },
            routeIndex: parsedMessage.routeIndex
          };

          this.channel.sendToQueue("aggregator", Buffer.from(JSON.stringify(response)), {
            correlationId,
          });

          this.channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    });

    this.channel.consume('product.getProductCategoriesList', async (msg) => {
      if (msg !== null) {
        try {
          const parsedMessage = JSON.parse(msg.content.toString());
          console.log("Received message for product.getProductCategoriesList:", parsedMessage);

          const correlationId = msg.properties.correlationId;

          const categories = await this.productServiceHandler.getProductCategoriesList();
          parsedMessage.resultStack = { getProductCategoriesResult: categories };

          parsedMessage.routeIndex++;


          const response = {
            ...parsedMessage,
            resultStack: {
              getProductCategoriesResult: categories
            }
          };

          this.channel.sendToQueue("aggregator", Buffer.from(JSON.stringify(response)), {
            correlationId,
          });

          this.channel.ack(msg);
        } catch (error) {
          console.error("Error processing message:", error);
        }
      }
    });
  }
}
