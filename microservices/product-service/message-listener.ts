import { inject, injectable } from 'inversify';
import amqp from 'amqplib';
import { ProductServiceHandler } from './application/product';
import { TYPES } from './types';

const RABBITMQ_URL = 'amqp://localhost';

interface QueueConfig {
  action: keyof ProductServiceHandler;
  resultStackKey: string;
}

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
    const connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await connection.createChannel();

    const queues: QueueConfig[] = [
      { action: 'getProductList', resultStackKey: 'getProductListResult' },
      { action: 'getProductCategoriesList', resultStackKey: 'getProductCategoriesResult' },
    ];

    try {
      for (const queue of queues) {
        await this.channel.assertQueue(`product.${queue.action}`, { durable: false });

        this.channel.consume(`product.${queue.action}`, async (msg) => {
          if (msg !== null) {
            await this.handleMessage(queue, msg);
            this.channel.ack(msg);
          }
        });
      }
    } catch (error) {
      console.error('Error starting RabbitMQ connection:', error);
    }
  }

  private async handleMessage(queue: QueueConfig, msg: amqp.ConsumeMessage) {
    const parsedMessage = JSON.parse(msg.content.toString());
    const correlationId = parsedMessage.correlationId;

    console.log(" REQUEST", parsedMessage.msgContent.request);
    const actionResult = await this.productServiceHandler[queue.action](parsedMessage.msgContent.request || parsedMessage.resultStack);
    parsedMessage.resultStack[queue.resultStackKey] = actionResult;
    parsedMessage.routeIndex++;

    console.log("ACTION RESULT", actionResult);
    const message = {
      correlationId,
      param: parsedMessage.param,
      msgContent: parsedMessage.msgContent,
      routeIndex: parsedMessage.routeIndex,
      resultStack: parsedMessage.resultStack,
    };

    this.channel.sendToQueue("aggregator", Buffer.from(JSON.stringify(message)), {
      correlationId,
    });
  }
}
