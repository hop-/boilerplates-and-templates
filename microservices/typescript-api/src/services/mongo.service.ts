import { Mongo } from '../libs/dbs/mongo/connect';
import { IService } from '../libs/interfaces/service.interface';

class MongoService implements IService {
  // eslint-disable-next-line class-methods-use-this
  public async start(): Promise<void> {
    Mongo.connect();
  }

  // eslint-disable-next-line class-methods-use-this
  public async stop(): Promise<void> {
    // Nothing to do
  }

  // TODO: add more methods
}

export default new MongoService();
