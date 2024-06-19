import kafkajs from 'kafkajs';
import kafkaClient from './kafka-client';

export type IKafkaTopicConfig = kafkajs.ITopicConfig;

export class KafkaUtils {
  static async createTopics(topics: kafkajs.ITopicConfig[]): Promise<boolean> {
    const admin = kafkaClient.admin();
    await admin.connect();

    return admin.createTopics({ topics });
  }
}
