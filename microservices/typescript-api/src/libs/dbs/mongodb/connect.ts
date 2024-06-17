import config = require('config');
import { Db, MongoClient } from 'mongodb';

const URL = config.get<string>('db.mongodb.uri');

export class MongoDb {
  private static dataBase: Db;

  public static async connect(): Promise<void> {
    const client = new MongoClient(URL);
    client.on('connectionReady', () => {
      console.log('Mongodb connected');
    });
    await client.connect();
    this.dataBase = client.db();
  }

  public static get db(): Db {
    return this.dataBase;
  }
}
