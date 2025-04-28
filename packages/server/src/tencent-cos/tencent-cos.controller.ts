import { Controller, Get, UseGuards } from '@nestjs/common';
import { TencentCosService } from './tencent-cos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('tencent-cos')
export class TencentCosController {
  constructor(private readonly tencentCosService: TencentCosService) {}

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
