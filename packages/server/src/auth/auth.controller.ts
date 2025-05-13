import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AdminAuthPayLoadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('auth')
@UseGuards(JwtAuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/token')
  @Public()
  /**
   * 管理员登录方法
   * @param data - 包含管理员用户名和密码的请求体
   * @returns 包含状态码、消息和访问令牌的数据对象
   */
  async adminLogin(@Body() data: AdminAuthPayLoadDto) {
    if (!data || !data.adminName || !data.adminPassword) {
      return { code: 400, message: 'Request body is invalid.', data: [] };
    }
    const result = await this.authService.validateAdmin(data);
    if (result) {
      return {
        code: 200,
        message: 'Admin login succeeded.',
        data: { access_token: result },
      };
    } else if (!result) {
      return {
        code: 401,
        message: 'The username or password is incorrect.',
        data: [],
      };
    }
    return { code: 401, message: 'Failed to login as admin.', data: [] };
  }

  @Get('admin/token')
  /**
   * 检查管理员令牌的有效性
   * @param req - Express 请求对象
   * @returns 包含状态码、消息和用户数据的数据对象
   */
  checkToken(@Req() req: Request) {
    if (req.user) {
      return {
        code: 200,
        message: 'Login succeeded.',
        data: req.user,
      };
    } else {
      return {
        code: 401,
        message: 'Unauthorized.',
        data: [],
      };
    }
  }
}
