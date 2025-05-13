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
import { PutFriendLinkLogo } from 'src/friend-link/entity/friendLink.entity';

/**
 * 腾讯云 COS 服务
 * @remarks 提供 COS 对象存储的上传、删除、密钥获取等功能
 */
@Injectable()
export class TencentCosService {
  private req!: CredentialData;
  private cos!: COS;
  public bucket!: string;
  private readonly logger = new Logger(TencentCosService.name);
  private readonly config: GetCredentialOptions =
    tencentCOSConfig.getTypeOrmConfig() as GetCredentialOptions;

  /**
   * 构造函数，初始化 COS 配置与实例
   */
  constructor() {
    this.config = tencentCOSConfig.getTypeOrmConfig() as GetCredentialOptions;
    this.initCOS().catch((err) => this.logger.error('初始化COS失败', err));
    this.bucket = tencentCOSConfig.getValue('TENCENT_COS_BUCKET_NAME');
  }

  /**
   * 初始化 COS 实例
   * @returns Promise<void>
   */
  private async initCOS() {
    this.req = await this.getTemporarySecretKey();
    this.cos = new COS({
      SecretId: this.req.credentials.tmpSecretId,
      SecretKey: this.req.credentials.tmpSecretKey,
      SecurityToken: this.req.credentials.sessionToken,
    });
  }

  /**
   * 获取 COS 临时密钥
   * @returns 临时密钥数据
   */
  public async getTemporarySecretKey(): Promise<CredentialData> {
    const result = await getCredential({
      secretId: this.config.secretId,
      secretKey: this.config.secretKey,
      durationSeconds: this.config.durationSeconds,
      region: this.config.region,
      policy: this.config.policy,
    });
    this.logger.log('TemporarySecretKey get succeed');
    this.logger.debug(`TemporarySecretKey: ${JSON.stringify(result)}`);
    return result;
  }

  /**
   * 上传对象到 COS
   * @param stream 文件流
   * @returns 上传后的文章输入对象
   */
  public async putArticle(stream: Stream): Promise<CreateArticleInput> {
    this.initCOS().catch((err) => this.logger.error('初始化COS失败', err));

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
              articleTitle: '',
              articleBucketName: this.bucket,
              articleBucketRegion: this.config.region as string,
              articleBucketKey: key,
            });
          } else {
            return null;
          }
        },
      );
    });
  }

  /**
   * 上传对象到 COS
   * @param stream 文件流
   * @returns 上传后的文章输入对象
   */
  public async putFriendLinkLogo(stream: Stream): Promise<PutFriendLinkLogo> {
    this.initCOS().catch((err) => this.logger.error('初始化COS失败', err));
    const name = `${uuidV4()}.png`;
    const key = `friend-link-logo/${name}`;
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
              linkImageBucketName: this.bucket,
              linkImageBucketRegion: this.config.region as string,
              linkImageBucketKey: key,
            });
          } else {
            return null;
          }
        },
      );
    });
  }

  /**
   * 删除 COS 对象
   * @param parm 删除对象参数
   * @returns Promise<any>
   */
  public async delObject(parm: DeleteObjectParams): Promise<any> {
    this.initCOS().catch((err) => this.logger.error('初始化COS失败', err));
    return new Promise((resolve, reject) => {
      this.cos.deleteObject(parm, (err) => {
        if (err) {
          reject(
            err instanceof Error
              ? err
              : new Error(err.message || JSON.stringify(err)),
          );
        }
        this.logger.log('Delete object succeed');
        resolve(null);
      });
    });
  }
}
