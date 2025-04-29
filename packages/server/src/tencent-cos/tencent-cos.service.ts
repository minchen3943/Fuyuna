import {
  CredentialData,
  getCredential,
  GetCredentialOptions,
} from 'qcloud-cos-sts';
import { tencentCOSConfig } from '@fuyuna/configs';
import { Injectable, Logger } from '@nestjs/common';
import { Stream } from 'stream';
import { v4 as uuidV4 } from 'uuid';
import COS = require('cos-nodejs-sdk-v5');
import { CreateArticleInput } from 'src/article/input/article.input';
import { DeleteObjectParams } from 'cos-nodejs-sdk-v5';

@Injectable()
export class TencentCosService {
  private req!: CredentialData;
  private cos!: COS;
  public bucket!: string;
  private readonly logger = new Logger(TencentCosService.name);
  private readonly config: GetCredentialOptions =
    tencentCOSConfig.getTypeOrmConfig() as GetCredentialOptions;
  constructor() {
    this.config = tencentCOSConfig.getTypeOrmConfig() as GetCredentialOptions;
    this.initCOS().catch((err) => this.logger.error('初始化COS失败', err));
    this.bucket = tencentCOSConfig.getValue('TENCENT_COS_BUCKET_NAME');
  }

  private async initCOS() {
    this.req = await this.getTemporarySecretKey();
    this.cos = new COS({
      SecretId: this.req.credentials.tmpSecretId,
      SecretKey: this.req.credentials.tmpSecretKey,
      SecurityToken: this.req.credentials.sessionToken,
    });
  }

  public async getTemporarySecretKey(): Promise<CredentialData> {
    const result = await getCredential({
      secretId: this.config.secretId,
      secretKey: this.config.secretKey,
      durationSeconds: this.config.durationSeconds,
      region: this.config.region,
      policy: this.config.policy,
    });
    this.logger.log('TemporarySecretKey get succeed');
    return result;
  }

  public async putObject(stream: Stream): Promise<CreateArticleInput> {
    const name = `${uuidV4()}.md`;
    const key = `article/${name}`;
    return new Promise((resolve, reject) => {
      this.cos.putObject(
        {
          Bucket: this.bucket,
          Region: this.config.region!,
          Key: key,
          Body: stream,
        },
        (err, data) => {
          if (err) {
            reject(
              err instanceof Error
                ? err
                : new Error(err.message || JSON.stringify(err)),
            );
          } else if (data.statusCode === 200) {
            this.logger.log(`Upload file succeed`);
            this.logger.debug(`${JSON.stringify(data)}`);
            resolve({
              article_title: '',
              article_name: name,
              article_bucket_name: this.bucket,
              article_bucket_region: this.config.region as string,
              article_key: key,
            });
          } else {
            return null;
          }
        },
      );
    });
  }

  public async delObject(parm: DeleteObjectParams): Promise<any> {
    return new Promise((resolve, reject) => {
      this.cos.deleteObject(parm, (err) => {
        if (err) {
          reject(
            err instanceof Error
              ? err
              : new Error(err.message || JSON.stringify(err)),
          );
        }
        this.logger.log('Delete article succeed');
        resolve(null);
      });
    });
  }
}
