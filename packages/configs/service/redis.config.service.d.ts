import { RedisOptions } from 'ioredis';

declare class RedisConfig {
  constructor(env: NodeJS.ProcessEnv);
  public getValue(key: string, throwOnMissing?: boolean): string;
  public ensureValues(keys: string[]): this;
  public getRedisConfig(): RedisOptions;
}

declare const redisConfig: RedisConfig;

export { redisConfig };
