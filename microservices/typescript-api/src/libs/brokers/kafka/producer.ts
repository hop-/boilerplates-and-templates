import kafkajs from 'kafkajs';
import kafkaClient from './kafka-client';

export interface IKafkaProducerSendOptions {
  topic: string,
  message: unknown,
}

export class KafkaProducer {
  private producer: kafkajs.Producer;

  constructor() {
    this.producer = kafkaClient.producer();
  }

  public async connect(): Promise<void> {
    await this.producer.connect();

    process.on('SIGINT', async () => {
      console.log('SIGINT - disconnecting producer');

      await this.producer.disconnect();
    });

    const errorTypes = ['unhandledRejection', 'uncaughtException'];
    errorTypes.forEach((type) => {
      process.on(type, async (err) => {
        console.log(`Catched ${type} error. Disconnecting the kafka producer`);
        console.log(err);

        await this.producer.disconnect();
        process.exit(1);
      });
    });
  }

  public async disconnect() {
    this.producer.disconnect();
  }

  public async send({ topic, message }: IKafkaProducerSendOptions): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
      compression: kafkajs.CompressionTypes.GZIP,
    });
    console.log('Message has published');
  }
}
