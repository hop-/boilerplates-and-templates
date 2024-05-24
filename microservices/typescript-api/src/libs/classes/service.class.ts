import { IService } from '../interfaces/service.interface';

export default abstract class Service implements IService {
  // eslint-disable-next-line class-methods-use-this
  public async start(): Promise<void> {}

  // eslint-disable-next-line class-methods-use-this
  public async stop(): Promise<void> {}
}
