/**
 * @file 网站数据服务文件
 * @description 实现网站数据相关的业务逻辑
 * @module DataService
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from './entity/data.entity';
import { Repository } from 'typeorm';

/**
 * @class DataService
 * @description 网站数据服务类，处理网站数据相关的业务逻辑
 * @property {Repository<Data>} dataRepo - 网站数据仓库实例
 */
@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  /**
   * 构造函数，注入 Data 仓库
   * @param dataRepo 网站数据实体仓库
   */
  constructor(
    @InjectRepository(Data)
    private readonly dataRepo: Repository<Data>,
  ) {}

  /**
   * 获取网站数据（id=1）
   * @returns 网站数据对象或 null
   */
  async getData(): Promise<Data | null> {
    const data = await this.dataRepo.findOneBy({ id: 1 });
    if (!data) {
      this.logger.warn('No data found');
      return null;
    }
    this.logger.log('Data retrieved successfully');
    this.logger.debug(`Data: ${JSON.stringify(data)}`);
    return data;
  }

  /**
   * 获取网站访问量（visitCount）
   * @returns 访问量或 null
   */
  async getVisitCount(): Promise<number | null> {
    const data = await this.dataRepo.findOneBy({ id: 1 });
    if (!data) {
      this.logger.warn('No visit count found');
      return null;
    }
    this.logger.log('Visit count retrieved successfully');
    this.logger.debug(`Visit count: ${data.visitCount}`);
    return data.visitCount;
  }

  /**
   * 获取网站点赞数（likeCount）
   * @returns 点赞数或 null
   */
  async getLikeCount(): Promise<number | null> {
    const data = await this.dataRepo.findOneBy({ id: 1 });
    if (!data) {
      this.logger.warn('No like count found');
      return null;
    }
    this.logger.log('Like count retrieved successfully');
    this.logger.debug(`Like count: ${data.likeCount}`);
    return data.likeCount;
  }

  /**
   * 增加网站访问量（visitCount）计数器 +1
   * @returns {Promise<number|null>} 增加后的访问量或 null
   */
  async addOneVisitCount(): Promise<number | null> {
    const data = await this.getData();
    if (!data) {
      this.logger.warn('No data found');
      return null;
    }
    data.visitCount += 1;
    await this.dataRepo.save(data);
    this.logger.log('Visit count incremented successfully');
    this.logger.debug(`Visit count: ${data.visitCount}`);
    return data.visitCount;
  }

  /**
   * 增加网站点赞数（likeCount）计数器 +1
   * @returns {Promise<number|null>} 增加后的点赞数或 null
   */
  async addOneLikeCount(): Promise<number | null> {
    const data = await this.getData();
    if (!data) {
      this.logger.warn('No data found');
      return null;
    }
    data.likeCount += 1;
    await this.dataRepo.save(data);
    this.logger.log('Like count incremented successfully');
    this.logger.debug(`Like count: ${data.likeCount}`);
    return data.likeCount;
  }

  /**
   * 重置网站访问量（visitCount）为 0
   * @returns {Promise<number|null>} 重置后的访问量或 null
   */
  async resetVisitCount(): Promise<number | null> {
    const data = await this.getData();
    if (!data) {
      this.logger.warn('No data found');
      return null;
    }
    data.visitCount = 0;
    await this.dataRepo.save(data);
    const result = await this.getData();
    if (!result) {
      this.logger.warn('No data found');
      return null;
    }
    this.logger.log('Visit count reset successfully');
    this.logger.debug(`Visit count: ${result.visitCount}`);
    return result.visitCount;
  }

  /**
   * 重置网站点赞数（likeCount）为 0
   * @returns {Promise<number|null>} 重置后的点赞数或 null
   */
  async resetLikeCount(): Promise<number | null> {
    const data = await this.getData();
    if (!data) {
      this.logger.warn('No data found');
      return null;
    }
    data.likeCount = 0;
    await this.dataRepo.save(data);
    const result = await this.getData();
    if (!result) {
      this.logger.warn('No data found');
      return null;
    }
    this.logger.log('Like count reset successfully');
    this.logger.debug(`Like count: ${result.likeCount}`);
    return result.likeCount;
  }
}
