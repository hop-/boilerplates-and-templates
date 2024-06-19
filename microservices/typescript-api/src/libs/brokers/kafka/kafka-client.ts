import kafkajs from 'kafkajs';

const brokers: string[] = process.env.KAFKA_HOST?.split(',') || ['kafka:9092'];
const clientId: string | undefined = process.env.KAFKA_CLIENT_ID ? `${process.env.KAFKA_CLIENT_ID}` : undefined;

const kafkaClient = new kafkajs.Kafka({
  clientId,
  brokers,
  retry: {
    initialRetryTime: 1000, // 1 sec
    maxRetryTime: 60 * 1000, // 1 min
    restartOnFailure: async (e: Error) => e instanceof kafkajs.KafkaJSError && e.retriable, // restart if retriable
  },
});

export default kafkaClient;
