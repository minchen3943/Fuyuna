/**
 * @file 友链服务文件
 * @description 实现友链相关的业务逻辑
 * @module FriendLinkService
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/constants';
import { FriendLink } from './entity/friendLink.entity';
import {
  UpdateFriendLinkInput,
  CreateFriendLinkInput,
} from './input/friendLink.input';

/**
 * @class FriendLinkService
 * @description 友链服务类，处理友链相关的业务逻辑
 * @property {Repository<FriendLink>} friendLinkRepo - 友链仓库实例
 */
@Injectable()
export class FriendLinkService {
  private readonly logger = new Logger(FriendLinkService.name);

  /**
   * 构造函数，注入 FriendLink 仓库与 Redis 实例
   * @param friendLinkRepo 友链实体仓库
   * @param redis 缓存实例
   */
  constructor(
    @InjectRepository(FriendLink)
    private readonly friendLinkRepo: Repository<FriendLink>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis
  ) {}

  /**
   * 获取全部友链（优先缓存）
   * @returns 友链数组或 null
   */
  public async findAll(): Promise<FriendLink[] | null> {
    const key = `friendLink:all`;
    const cached = await this.redis.get(key);
    if (cached) {
      const links = JSON.parse(cached) as FriendLink[];
      links.forEach((link) => {
        if (link.createdAt) link.createdAt = new Date(link.createdAt);
        if (link.updatedAt) link.updatedAt = new Date(link.updatedAt);
      });
      this.logger.log(`(cache) Found ${links.length} friend links`);
      this.logger.debug(`(cache) FriendLinks: ${JSON.stringify(links)}`);
      return links;
    }
    const links = await this.friendLinkRepo.find({
      where: { linkStatus: 1 },
      order: { createdAt: 'DESC' },
    });
    if (links.length > 0) {
      await this.redis.set(key, JSON.stringify(links), 'EX', 3600);
      this.logger.log(`Found ${links.length} friend links`);
      this.logger.debug(`FriendLinks: ${JSON.stringify(links)}`);
      return links;
    }
    this.logger.warn('No friend links found');
    return null;
  }

  /**
   * 根据 id 获取友链
   * @param linkId 友链 id
   * @returns 友链对象或 null
   */
  public async findById(linkId: number): Promise<FriendLink | null> {
    const key = `friendLink:id:${linkId}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const link = JSON.parse(cached) as FriendLink;
      link.createdAt = new Date(link.createdAt);
      link.updatedAt = new Date(link.updatedAt);
      this.logger.log(`(cache) Found friend link id=${linkId}`);
      this.logger.debug(`(cache) FriendLink: ${JSON.stringify(link)}`);
      return link;
    }
    const link = await this.friendLinkRepo.findOneBy({ linkId: linkId });
    if (link) {
      await this.redis.set(key, JSON.stringify(link), 'EX', 3600);
      this.logger.log(`Found friend link id=${linkId}`);
      this.logger.debug(`FriendLink: ${JSON.stringify(link)}`);
      return link;
    }
    this.logger.warn(`No friend link found for id=${linkId}`);
    return null;
  }

  /**
   * 分页获取友链
   * @param page 页码（从 1 开始）
   * @param pageSize 每页数量
   * @returns 友链数组
   */
  public async findByPage(
    page: number,
    pageSize: number
  ): Promise<FriendLink[]> {
    const key = `friendLink:page:${page}:${pageSize}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const friendLinks = JSON.parse(cached) as FriendLink[];
      friendLinks.forEach((friendLink) => {
        friendLink.createdAt = new Date(friendLink.createdAt);
        friendLink.updatedAt = new Date(friendLink.updatedAt);
      });
      this.logger.log(
        `(cache) Found ${friendLinks.length} friendLinks on page ${page}`
      );
      this.logger.debug(`(cache) friendLinks: ${JSON.stringify(friendLinks)}`);
      return friendLinks;
    }
    const [friendLinks] = await this.friendLinkRepo.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { linkStatus: 1 },
      order: { createdAt: 'DESC' },
    });
    this.logger.log(`Found ${friendLinks.length} friendLinks for page=${page}`);
    this.logger.debug(`friendLinks: ${JSON.stringify(friendLinks)}`);
    return friendLinks;
  }

  /**
   * @method getTotalPages
   * @description 计算友链总页数
   * @param pageSize 每页数量
   * @returns 包含总页数的对象
   */
  public async getTotalPages(
    pageSize: number
  ): Promise<{ totalPages: number }> {
    const key = `friendLink:totalPage:${pageSize}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const totalLinks = JSON.parse(cached) as number;
      const totalPages = Math.ceil(totalLinks / pageSize);
      this.logger.log(
        `(cache) Total pages: ${totalPages} for page size ${pageSize}`
      );
      this.logger.debug(`Total friend links: ${totalLinks}`);
      return { totalPages };
    }
    const totalLinks = await this.friendLinkRepo.count();
    await this.redis.set(key, JSON.stringify(totalLinks), 'EX', 18000);
    const totalPages = Math.ceil(totalLinks / pageSize);
    this.logger.log(`Total pages: ${totalPages} for page size ${pageSize}`);
    this.logger.debug(`Total friend links: ${totalLinks}`);
    return { totalPages };
  }

  /**
   * 创建友链
   * @param friendLink 友链对象
   * @returns 创建的友链对象或 null
   */
  public async createFriendLink(
    friendLink: CreateFriendLinkInput
  ): Promise<FriendLink | null> {
    const result = await this.friendLinkRepo.save(friendLink);
    if (result) {
      await this.redis.del('friendLink:all');
      await this.redis.del('friendLink:page:*');
      await this.redis.del('friendLink:totalPage:*');
      await this.redis.del(`friendLink:id:${result.linkId}`);
      this.logger.log(`Created friend link id=${result.linkId}`);
      this.logger.debug(`Created FriendLink: ${JSON.stringify(result)}`);
      return result;
    }
    this.logger.warn('Failed to create friend link');
    return null;
  }

  /**
   * 更新友链信息
   * @param linkId 友链 id
   * @param updateData 更新数据
   * @returns 更新后的友链对象或 null
   */
  public async updateFriendLink(
    linkId: number,
    updateData: UpdateFriendLinkInput
  ): Promise<FriendLink | null> {
    const friendLink = await this.findById(linkId);
    if (!friendLink) {
      this.logger.warn(`No friendLink found for update, id=${linkId}`);
      return null;
    }
    // 只更新有值的字段
    const fields: (keyof FriendLink & keyof UpdateFriendLinkInput)[] = [
      'linkStatus',
      'linkTitle',
      'linkUrl',
      'linkDescription',
      'linkImageBucketKey',
      'linkImageBucketName',
      'linkImageBucketRegion',
    ];
    fields.forEach((key) => {
      if (updateData[key] !== undefined && updateData[key] !== null) {
        (friendLink as Record<typeof key, any>)[key] = updateData[key];
      }
    });

    const result = await this.friendLinkRepo.save(friendLink);
    if (result) {
      await this.redis.del('friendLink:all');
      await this.redis.del(`friendLink:id:${linkId}`);
      await this.redis.del('friendLink:page:*');
      this.logger.log(`Updated friendLink id=${linkId}`);
      this.logger.debug(`Updated FriendLink: ${JSON.stringify(result)}`);
      return await this.findById(linkId);
    } else {
      this.logger.warn(`Failed to update friendLink id=${linkId}`);
      return null;
    }
  }

  /**
   * 更新友链状态
   * @param linkId 友链 id
   * @param status 新状态
   * @returns 更新后的友链对象或 null
   */
  public async updateStatus(
    linkId: number,
    status: number
  ): Promise<FriendLink | null> {
    if (!(await this.findById(linkId))) {
      this.logger.warn(`No friend link found for status update, id=${linkId}`);
      return null;
    }
    const result = await this.friendLinkRepo.save({
      linkId: linkId,
      link_status: status,
    });
    if (result) {
      await this.redis.del(`friendLink:id:${linkId}`);
      await this.redis.del('friendLink:all');
      await this.redis.del('friendLink:page:*');
      await this.redis.del('friendLink:totalPage:*');
      this.logger.log(
        `Friend link status updated successfully for ID ${linkId}`
      );
      this.logger.debug(`Updated friend link status: ${status}`);
      return this.findById(linkId);
    } else {
      this.logger.warn(`Failed to update friend link status for ID ${linkId}`);
      return null;
    }
  }

  /**
   * 删除友链
   * @param id 友链 id
   * @returns 是否删除成功
   * @todo 删除友链时，需要删除相关的图片或文件
   */
  public async deleteFriendLink(id: number): Promise<boolean> {
    const result = await this.friendLinkRepo.delete(id);
    if (result.affected && result.affected > 0) {
      await this.redis.del('friendLink:all');
      await this.redis.del('friendLink:page:*');
      await this.redis.del(`friendLink:totalPage:*`);
      await this.redis.del(`friendLink:id:${id}`);
      this.logger.log(`Deleted friend link id=${id}`);
      return true;
    }
    this.logger.warn(`No friend link found for delete, id=${id}`);
    return false;
  }
}
