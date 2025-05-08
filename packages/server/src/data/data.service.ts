import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Data } from './entity/data.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    @InjectRepository(Data)
    private readonly dataRepo: Repository<Data>,
  ) {}

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

  async resetVisitCount(): Promise<number | null> {
    const data = await this.getData();
    if (!data) {
      this.logger.warn('No data found');
      return null;
    }
    data.visitCount = 0;
    await this.dataRepo.save(data);
    this.logger.log('Visit count reset successfully');
    this.logger.debug(`Visit count: ${data.visitCount}`);
    return data.visitCount;
  }

  async resetLikeCount(): Promise<number | null> {
    const data = await this.getData();
    if (!data) {
      this.logger.warn('No data found');
      return null;
    }
    data.likeCount = 0;
    await this.dataRepo.save(data);
    this.logger.log('Like count reset successfully');
    this.logger.debug(`Like count: ${data.likeCount}`);
    return data.likeCount;
  }
}
