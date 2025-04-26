import { Injectable, Logger } from '@nestjs/common';
import { AdminAuthPayLoadDto } from './dto/auth.dto';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly adminService: AdminService,
    private jwtService: JwtService,
  ) {}

  public async adminLogin(
    data: AdminAuthPayLoadDto,
  ): Promise<string | boolean> {
    if (await this.adminService.checkAdminPassWord(data)) {
      const payload = { username: data.adminName };
      const access_token = this.jwtService.sign(payload);
      this.logger.log(`Admin get access_token succeed with ${data.adminName}`);
      return access_token;
    }
    return false;
  }
}
