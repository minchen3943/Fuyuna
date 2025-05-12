import { Controller, Delete } from '@nestjs/common';
import { CacheService } from './cache.service';
import { CacheResult } from './entity/cacheResult.entity';

@Controller('cache')
/**
 * 缓存相关接口控制器，负责处理缓存管理相关的 HTTP 请求
 * @remarks 仅允许通过 JwtAuthGuard 认证的用户访问
 */
export class CacheController {
  /**
   * 构造函数，注入缓存服务
   * @param cacheService 缓存服务实例
   */
  constructor(private readonly cacheService: CacheService) {}

  /**
   * 清除所有缓存
   * @returns {Promise<CacheResult>} 缓存清理结果对象，包含状态码、消息及清理数量
   * @remarks 仅管理员或有权限用户可调用，清理后返回操作结果
   */
  @Delete('clear')
  async clearCache(): Promise<CacheResult> {
    const result = await this.cacheService.clearAllCache();
    if (typeof result === 'number' && result > 0) {
      return { code: 200, message: 'Cache cleared successfully', data: result };
    } else if (result === 0) {
      return { code: 200, message: 'No cache to clear', data: result };
    }
    return { code: 204, message: 'Failed to clear cache', data: null };
  }
}
