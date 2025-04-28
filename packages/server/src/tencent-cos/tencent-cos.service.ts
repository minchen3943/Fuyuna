import {
  CredentialData,
  getCredential,
  GetCredentialOptions,
} from 'qcloud-cos-sts';
import { tencentCOSConfig } from '@fuyuna/configs';
import { Injectable, Logger } from '@nestjs/common';
import COS, { COSOptions } from 'cos-nodejs-sdk-v5';

@Injectable()
export class TencentCosService {
  private readonly logger = new Logger(TencentCosService.name);

  private async cos(): Promise<COS> {
    const req = await this.getTemporarySecretKey();
    const option: COSOptions = {
      SecretId: req.credentials.tmpSecretId,
      SecretKey: req.credentials.tmpSecretId,
      SecurityToken: req.credentials.sessionToken,
    };
    return new COS(option);
  }

  public async getTemporarySecretKey(): Promise<CredentialData> {
    // eslint-disable-next-line
    const config: GetCredentialOptions = tencentCOSConfig.getTypeOrmConfig();
    try {
      const result = await getCredential({
        secretId: config.secretId,
        secretKey: config.secretKey,
        durationSeconds: config.durationSeconds,
        region: config.region,
        policy: config.policy,
      });
      this.logger.log('TemporarySecretKey get succeed');
      return result;
    } catch (error) {
      this.logger.error('Failed to get TemporarySecretKey', error);
      throw error;
    }
  }
}
