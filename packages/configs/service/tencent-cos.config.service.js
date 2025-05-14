import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

class TencentCOSConfig {
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
      secretId: this.getValue('TENCENT_COS_SECRET_ID'),
      secretKey: this.getValue('TENCENT_COS_SECRET_KEY'),
      policy: {
        version: '2.0',
        statement: [
          {
            action: ['name/cos:PutObject', 'name/cos:DeleteObject'],
            effect: 'allow',
            resource: [
              'qcs::cos:ap-guangzhou:uid/1354220332:mochenwu-1354220332/article/*',
              'qcs::cos:ap-guangzhou:uid/1354220332:mochenwu-1354220332/friend-link-logo/*',
            ],
          },
        ],
      },
      region: this.getValue('TENCENT_COS_REGION'),
      durationSeconds: 180,
    };
  }
}

const tencentCOSConfig = new TencentCOSConfig(process.env).ensureValues([
  'TENCENT_COS_SECRET_ID',
  'TENCENT_COS_SECRET_KEY',
  'TENCENT_COS_REGION',
]);

export { tencentCOSConfig };
