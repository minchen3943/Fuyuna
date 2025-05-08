import { Controller, Delete, UseGuards } from '@nestjs/common';
import { CacheService } from './cache.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CacheResult } from './entity/cacheResult.entity';

@Controller('cache')
@UseGuards(JwtAuthGuard)
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}
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
