import { ITopicConfig } from 'kafkajs';
import kafkaClient from './kafka-client';

export type IKafkaTopicConfig = ITopicConfig;

export class KafkaUtils {
  static async createTopics(topics: ITopicConfig[]): Promise<boolean> {
    const admin = kafkaClient.admin();
    await admin.connect();

    return admin.createTopics({ topics });
  }
}
