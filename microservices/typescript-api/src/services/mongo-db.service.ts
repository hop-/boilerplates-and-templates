import { Db } from 'mongodb';
import { MongoDb } from '../libs/dbs/mongodb/connect';
import { IService } from '../libs/interfaces/service.interface';

class MongoDbService implements IService {
  // eslint-disable-next-line class-methods-use-this
  public async start(): Promise<void> {
    MongoDb.connect();
  }

  // eslint-disable-next-line class-methods-use-this
  public async stop(): Promise<void> {
    // Nothing to do
  }

  public static get db(): Db {
    return MongoDb.db;
  }

  // TODO: add more methods
}

export default new MongoDbService();
