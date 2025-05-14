import { Controller, Get, UseGuards } from '@nestjs/common';
import { TencentCosService } from './tencent-cos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

/**
 * 腾讯云 COS 控制器
 * @remarks 提供获取 COS 临时密钥等接口
 */
@Controller('tencent-cos')
export class TencentCosController {
  /**
   * 构造函数，注入 TencentCosService
   * @param tencentCosService COS 服务实例
   */
  constructor(private readonly tencentCosService: TencentCosService) {}

  /**
   * 获取 COS 临时密钥
   * @returns 临时密钥数据
   */
  @Get('/secret-key')
  @UseGuards(JwtAuthGuard)
  async getTemporarySecretKey() {
    const result = await this.tencentCosService.getTemporarySecretKey();
    if (result) {
      return {
        code: 200,
        message: 'TemporarySecretKey get succeed',
        data: result,
      };
    }
    return {
      code: 204,
      message: 'Failed to get TemporarySecretKey',
      data: null,
    };
  }
}
