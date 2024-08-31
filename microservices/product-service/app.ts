import container from './inversify.config';
import { MessageListener } from './message-listener';
import { TYPES } from './types';
import { connectDB } from './utils/db';

async function main() {

  connectDB();
  const messageListener = container.get<MessageListener>(TYPES.MessageListener);

  try {
    await messageListener.start();
    console.log("Message listener is up and running!");
  } catch (error) {
    console.error("Error starting message listener:", error);
  }
}

main();
