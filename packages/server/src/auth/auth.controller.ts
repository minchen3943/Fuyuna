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
  async adminLogin(@Body() data: AdminAuthPayLoadDto) {
    if (!data || !data.adminName || !data.adminPassword) {
      return { code: 400, message: `Request body error`, data: null };
    }
    const result = await this.authService.validateAdmin(data);
    if (result) {
      return {
        code: 200,
        message: `Login admin succeed`,
        data: { access_token: result },
      };
    } else if (!result) {
      return {
        code: 401,
        message: `The username or password is incorrect`,
        data: null,
      };
    }
    return { code: 401, message: `Failed to login admin`, data: null };
  }

  @Get('admin/token')
  checkToken(@Req() req: Request) {
    if (req.user) {
      return {
        code: 200,
        message: 'Login succeed',
        data: req.user,
      };
    } else {
      return {
        code: 401,
        message: 'Unauthorized',
        data: null,
      };
    }
  }
}
