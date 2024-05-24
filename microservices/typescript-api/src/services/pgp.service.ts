import { PrismaClient } from '@prisma/client';
import { IService } from '../libs/interfaces/service.interface';

class PgpService implements IService {
  private mDb?: PrismaClient = undefined;

  public async start(): Promise<void> {
    this.mDb = new PrismaClient();
  }

  public async stop(): Promise<void> {
    this.mDb?.$disconnect();
  }

  public get db() {
    return this.mDb;
  }
  // TODO: add more methods
}

export default new PgpService();
