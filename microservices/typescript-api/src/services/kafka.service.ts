import Bluebird from 'bluebird';
import { IService } from '../libs/interfaces/service.interface';
import { exampleHandler } from '../handlers/example.handler';
import { KafkaConsumer } from '../libs/brokers/kafka/consumer';
import { KafkaProducer } from '../libs/brokers/kafka/producer';

// eslint-disable-next-line no-shadow
export enum Topics {
  ExampleTopic = 'ExampleTopic',
  // TODO: add topics here
}

class KafkaService implements IService {
  private mConsumers: KafkaConsumer[] = [];

  private mProducer: KafkaProducer = new KafkaProducer();

  constructor(consumers: KafkaConsumer[]) {
    this.mConsumers = consumers;
  }

  public async start(): Promise<void> {
    // TODO: create topics with KafkaUtils.createTopics() if needed
    await Bluebird.map(this.mConsumers, async (c) => {
      await c.connect();
      await c.run();
    });

    await this.mProducer.connect();
  }

  public async stop(): Promise<void> {
    await Bluebird.map(this.mConsumers, async (c) => {
      await c.disconnect();
    });

    await this.mProducer.disconnect();
  }

  public async send(topic: string, message: unknown) {
    return this.mProducer.send({ topic, message });
  }

  // TODO: add mode methods
}

// Consumers
const exampleConsumer = new KafkaConsumer('example-consumer-group', [Topics.ExampleTopic]);
exampleConsumer.onMessage(exampleHandler);

export default new KafkaService([
  exampleConsumer,
  // TODO: add more consumers
]);
