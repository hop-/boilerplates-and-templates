import * as crypto from 'crypto';

// eslint-disable-next-line class-methods-use-this
function getHash(req: unknown): string {
  const md5Hasher = crypto.createHash('md5');

  // TODO: fix/remove circular references in data
  return md5Hasher.update(JSON.stringify(req)).digest('hex');
}

function getExpDate(expTime: number | undefined): Date {
  const exp = (expTime && Number.isFinite(expTime) && expTime > 0)
    ? expTime
    : 365 * 24 * 60 * 60 * 1000; // default 1 year

  return new Date(Date.now() + exp);
}

export abstract class CacheDriver<Req, Res> {
  constructor(private name: string, private expTime?: number) { }

  abstract find(name: string, hash: string): Promise<Res | undefined>;

  abstract store(name: string, hash: string, exp: Date, res: Res): Promise<void>;

  async hit(req: Req): Promise<Res | undefined> {
    const hash = getHash(req);
    const found = await this.find(this.name, hash);
    if (found) {
      console.log(`Resource hit from the cache: ${hash}`);
    }
    return found;
  }

  cache(req: Req, res: Res): Promise<void> {
    const hash = getHash(req);
    const exp = getExpDate(this.expTime);

    return this.store(this.name, hash, exp, res);
  }
}
