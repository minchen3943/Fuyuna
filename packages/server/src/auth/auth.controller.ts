import { Body, Controller, Post } from '@nestjs/common';
import { AdminAuthPayLoadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async adminLogin(@Body() data: AdminAuthPayLoadDto) {
    if (!data || !data.adminName || !data.adminPassword) {
      return { code: 400, message: `Request body error`, data: null };
    }
    const result = await this.authService.adminLogin(data);
    if (typeof result === 'string') {
      return {
        code: 200,
        message: `Login admin succeed`,
        data: { access_token: result },
      };
    } else if (typeof result === 'boolean' || result == false) {
      return {
        code: 401,
        message: `The username or password is incorrect`,
        data: null,
      };
    }
    return { code: 401, message: `Failed to login admin`, data: null };
  }
}
