import { CacheDriver } from './cache-driver.class';

export abstract class CachedProcessor<Input, Output> {
  constructor(private cacheDriver: CacheDriver<Input, Output>) { }

  async convert(data: Input): Promise<Output> {
    // Check for cache hit
    const hit = await this.cacheDriver.hit(data);
    if (hit) {
      // Return from cache
      return hit;
    }

    const processedData = await this.process(data);
    await this.cacheDriver.cache(data, processedData);

    return processedData;
  }

  protected abstract process(data: Input): Promise<Output>;
}
