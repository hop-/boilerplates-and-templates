import * as cron from 'node-cron';
import { Collection } from 'mongodb';
import { MongoDb } from '../dbs/mongodb/connect';
import { CacheDriver } from '../classes/cache-driver.class';

const cacheExpTime = Number(process.env.CACHE_EXP_TIME_MS || -1);

// Mongodb implementation of CacheDriver
// Can be used on CachedConverter implementations
export class MongoCacheDriver<Req, Res> extends CacheDriver<Req, Res> {
  private collection: Collection;

  constructor(name: string) {
    super(name, cacheExpTime);

    this.collection = MongoDb.db.collection(name);
    this.collection.createIndex(['hash', 'exp'], { unique: true });

    // Schedule to run cleanup job daily at 00:11
    cron.schedule('11 0 * * *', async () => {
      await this.cleanup();
    });
  }

  async find(_name: string, hash: string): Promise<Res | undefined> {
    const h = await this.collection.findOne({ hash, exp: { $gt: new Date() } }, { sort: { exp: -1 } });

    return h?.res;
  }

  async store(_name: string, hash: string, exp: Date, res: Res): Promise<void> {
    await this.collection.insertOne({ hash, exp, res });
  }

  private async cleanup() {
    console.log('Cleaning up exired cache data -', new Date());

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const result = await this.collection.deleteMany({ exp: { $lt: today } });

    console.log(`Removed ${result.deletedCount} cache data`);
  }
}
