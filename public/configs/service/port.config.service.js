import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class PortConfig {
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

  getNestPortConfig() {
    return this.getValue('NEST_PORT');
  }

  getNextPortConfig() {
    return this.getValue('NEXT_PORT');
  }
}
const portConfig = new PortConfig(process.env).ensureValues([
  'NEST_PORT',
  'NEXT_PORT',
]);
export { portConfig };
