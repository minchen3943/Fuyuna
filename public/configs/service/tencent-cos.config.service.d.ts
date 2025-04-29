import { GetCredentialOptions } from 'qcloud-cos-sts';

declare class TencentCOSConfig {
  constructor(env: { [k: string]: string });
  public getValue(key: string, throwOnMissing?: boolean): string;
  public ensureValues(keys: string[]): this;
  public getTypeOrmConfig(): GetCredentialOptions;
}

declare const tencentCOSConfig: TencentCOSConfig;

export { tencentCOSConfig };
