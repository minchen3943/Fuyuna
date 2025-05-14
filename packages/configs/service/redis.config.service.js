import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class RedisConfig {
  constructor(env) {
    this.env = env;
  }

  getValue(key, throwOnMissing = true) {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  ensureValues(keys) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  getRedisConfig() {
    if (this.getValue('REDIS_PASSWORD_EXISTS') === 'true') {
      return {
        host: this.getValue('REDIS_HOST'),
        port: this.getValue('REDIS_PORT'),
        password: this.getValue('REDIS_PASSWORD'),
        db: this.getValue('REDIS_DB'),
        ttl: this.getValue('REDIS_TTL'),
      };
    } else {
      return {
        host: this.getValue('REDIS_HOST'),
        port: this.getValue('REDIS_PORT'),
        db: this.getValue('REDIS_DB'),
        ttl: this.getValue('REDIS_TTL'),
      };
    }
  }
}

const redisConfig = new RedisConfig(process.env).ensureValues([
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'REDIS_DB',
  'REDIS_TTL',
]);

export { redisConfig };
