import { inject, injectable } from 'inversify';
import amqp from 'amqplib';
import { UserServiceHandler } from './application/user';
import { TYPES } from './types';

const RABBITMQ_URL = 'amqp://localhost';

@injectable()
export class MessageListener {
  private channel!: amqp.Channel;
  private userServiceHandler: UserServiceHandler;

  constructor(
    @inject(TYPES.UserServiceHandler) userServiceHandler: UserServiceHandler
  ) {
    this.userServiceHandler = userServiceHandler;
  }

  async start() {
    const connection = await amqp.connect(RABBITMQ_URL);
    this.channel = await connection.createChannel();

    const queues = [
      { name: 'user.getUserList', handler: this.handleUserList.bind(this) },
      { name: 'user.getRoleList', handler: this.handleRoleList.bind(this) },
      { name: 'user.addUser', handler: this.handleAddUser.bind(this) },
      { name: 'user.loginUser', handler: this.handleLoginUser.bind(this) },

      { name: 'user.deleteUser', handler: this.handleDeleteUser.bind(this) }



    ];

    try {
      for (const queue of queues) {
        await this.channel.assertQueue(queue.name, { durable: false });

        this.channel.consume(queue.name, async (msg) => {
          if (msg !== null) {
            await queue.handler(msg);

            this.channel.ack(msg);
                                    //aggregatora gönder

          }
        });
      }
    } catch (error) {
      console.error('Error starting RabbitMQ connection:', error);
    }
  }

  private async handleUserList(msg: amqp.ConsumeMessage) {
    const parsedMessage = JSON.parse(msg.content.toString());
    const correlationId = parsedMessage.correlationId;
    const productList = parsedMessage.resultStack.getProductListResult;

    const usersWithRoles = await this.userServiceHandler.getUserList(productList);
    parsedMessage.resultStack.getUserListResult = usersWithRoles;
    parsedMessage.routeIndex++;

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



  private async handleRoleList(msg: amqp.ConsumeMessage) {
    const parsedMessage = JSON.parse(msg.content.toString());
    const correlationId = parsedMessage.correlationId;

    const roleList = await this.userServiceHandler.getRoleList();
    parsedMessage.resultStack.getRoleListResult = roleList;
    parsedMessage.routeIndex++;

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

  private async handleAddUser(msg: amqp.ConsumeMessage) {
    const parsedMessage = JSON.parse(msg.content.toString());
    const correlationId = parsedMessage.correlationId;

    const request = parsedMessage.msgContent.request;
    parsedMessage.routeIndex++;


    await this.userServiceHandler.addUser(request);

    const message = {
      correlationId: parsedMessage.correlationId,
      param: parsedMessage.param,
      msgContent: parsedMessage.msgContent,
      routeIndex: parsedMessage.routeIndex,
      resultStack: parsedMessage.resultStack,
      request: request 
    };

    this.channel.sendToQueue("aggregator", Buffer.from(JSON.stringify(message)), {
      correlationId,
    });
  }

  private async handleDeleteUser(msg: amqp.ConsumeMessage) {
    const parsedMessage = JSON.parse(msg.content.toString());
    const correlationId = parsedMessage.correlationId;

    const request = parsedMessage.msgContent.request;
    parsedMessage.routeIndex++;


    await this.userServiceHandler.deleteUser(request);

    const message = {
      correlationId: parsedMessage.correlationId,
      param: parsedMessage.param,
      msgContent: parsedMessage.msgContent,
      routeIndex: parsedMessage.routeIndex,
      resultStack: parsedMessage.resultStack,
      request: request 
    };

    this.channel.sendToQueue("aggregator", Buffer.from(JSON.stringify(message)), {
      correlationId,
    });
  }


  private async handleLoginUser(msg: amqp.ConsumeMessage) {
    const parsedMessage = JSON.parse(msg.content.toString());
    const correlationId = parsedMessage.correlationId;

    const request = parsedMessage.msgContent.request;
    parsedMessage.routeIndex++;


    await this.userServiceHandler.loginUser(request);

    const message = {
      correlationId: parsedMessage.correlationId,
      param: parsedMessage.param,
      msgContent: parsedMessage.msgContent,
      routeIndex: parsedMessage.routeIndex,
      resultStack: parsedMessage.resultStack,
      request: request 
    };

    this.channel.sendToQueue("aggregator", Buffer.from(JSON.stringify(message)), {
      correlationId,
    });
  }




  

  
}
