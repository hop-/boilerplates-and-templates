/* eslint-disable class-methods-use-this */
import { Pgt } from '../libs/dbs/pgt/connect';
import { IService } from '../libs/interfaces/service.interface';

class PgtService implements IService {
  public async start(): Promise<void> {
    Pgt.connect();
    Pgt.migrate(); // TODO: run migration separatly
  }

  public async stop(): Promise<void> {
    // Nothing to do
  }

  public get dataSource() {
    return Pgt.dataSource;
  }
  // TODO: add more methods
}

export default new PgtService();
