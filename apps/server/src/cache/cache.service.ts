import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/constants';

/**
 * @class CacheService
 * @description 缓存管理服务，提供清除所有 Redis 缓存等功能
 */
@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);

  /**
   * 构造函数，注入 Redis 客户端
   * @param redis Redis 客户端实例
   */
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis
  ) {}

  /**
   * 清除所有 Redis 缓存
   * @returns {Promise<string>} 清理结果描述
   * @remarks 生产环境请谨慎调用，建议加权限保护
   */
  async clearAllCache(): Promise<number> {
    const keys = await this.redis.keys('*');
    if (keys.length === 0) {
      this.logger.log('Redis 缓存已为空');
      return 0;
    }
    await this.redis.del(...keys);
    this.logger.log(`已清除所有 Redis 缓存，共 ${keys.length} 个键`);
    return keys.length;
  }
}
