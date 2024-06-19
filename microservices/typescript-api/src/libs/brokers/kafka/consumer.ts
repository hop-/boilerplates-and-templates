import kafkajs from 'kafkajs';
import * as Bluebird from 'bluebird';
import kafkaClient from './kafka-client';

const kafkaDefaultOptions = {
  maxBytesPerPartition: 1024, // 1KB
  maxBytes: 100 * 1024, // 100KB
  heartbeatInterval: 3 * 1000, // 3 sec
  sessionTimeout: 5 * 60 * 1000, // 5 min
  maxMessagesPerCommit: 10, // message count
};

export class KafkaConsumer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private messageHandler: (payload: any) => Promise<void>;

  private consumer: kafkajs.Consumer;

  private kafkaOptions: kafkajs.ConsumerConfig;

  constructor(
    groupId: string,
    private topics: string[],
    private retry: boolean | number = false,
    options?: kafkajs.ConsumerConfig,
  ) {
    this.kafkaOptions = { ...kafkaDefaultOptions, ...options, groupId };
    this.consumer = kafkaClient.consumer(this.kafkaOptions);
    this.messageHandler = async () => {};
  }

  public async connect(): Promise<void> {
    await this.consumer.connect();
    await Bluebird.map(this.topics, async (topic) => this.consumer.subscribe({ topic }));
  }

  public async disconnect() {
    return this.consumer.disconnect();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public onMessage(callback: (message: any) => Promise<void>): void {
    this.messageHandler = callback;
  }

  public async run(): Promise<void> {
    let messageHandler: (
      message: kafkajs.KafkaMessage,
      resolveOffset: (offset: string) => void,
      heartbeat: () => Promise<void>
    ) => Promise<void>;
    if (this.retry === true) {
      messageHandler = async (
        message: kafkajs.KafkaMessage,
        resolveOffset: (offset: string) => void,
        heartbeat: () => Promise<void>,
      ) => {
        await this.messageHandler(JSON.parse(message.value?.toString() || '{}'));
        resolveOffset(message.offset);

        return heartbeat();
      };
    } else if (typeof (this.retry) === 'number' && this.retry > 0) {
      messageHandler = async (
        message: kafkajs.KafkaMessage,
        resolveOffset: (offset: string) => void,
        heartbeat: () => Promise<void>,
      ) => {
        for (let i = 0; i < Number(this.retry); i++) {
          try {
            // eslint-disable-next-line no-await-in-loop
            await this.messageHandler(JSON.parse(message.value?.toString() || '{}'));
            break;
          } catch (e) {
            console.log(`Message handling reached the max retires ${this.retry} err`, e);
            console.log('Skipping message');
          }
        }
        resolveOffset(message.offset);

        return heartbeat();
      };
    } else {
      messageHandler = async (
        message: kafkajs.KafkaMessage,
        resolveOffset: (offset: string) => void,
        heartbeat: () => Promise<void>,
      ) => {
        try {
          await this.messageHandler(JSON.parse(message.value?.toString() || '{}'));
        } catch (e) {
          console.log('Message handling err', e);
          console.log('Skipping message');
        }
        resolveOffset(message.offset);

        return heartbeat();
      };
    }

    return this.consumer.run({
      eachBatchAutoResolve: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      eachBatch: async (payload: { batch: any, resolveOffset: any, heartbeat: any }) => {
        const { batch, resolveOffset, heartbeat } = payload;
        const keepAlive = setInterval(async () => {
          try {
            await heartbeat();
          } catch (e) {
            console.error('Kafka heartbeat failed:', e);
          }
        }, this.kafkaOptions.heartbeatInterval || 1000 - 100);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await Promise.all(batch.messages.map((message: any) => messageHandler(message, resolveOffset, heartbeat)));

        clearInterval(keepAlive);
      },
    });
  }
}
