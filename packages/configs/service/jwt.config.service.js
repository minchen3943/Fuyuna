import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class JwtConfig {
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

  getTypeOrmConfig() {
    return {
      secret: this.getValue('JWT_SECRET'),
      signOptions: {
        expiresIn: this.getValue('JWT_EXPIRES_IN'),
        issuer: this.getValue('JWT_ISSUER'),
        algorithm: this.getValue('JWT_ALGORITHM'),
      },
    };
  }
}
const jwtConfig = new JwtConfig(process.env).ensureValues([
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_ISSUER',
  'JWT_ALGORITHM',
]);
export { jwtConfig };
