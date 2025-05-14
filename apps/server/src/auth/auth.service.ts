import { Injectable, Logger } from '@nestjs/common';
import { AdminAuthPayLoadDto } from './dto/auth.dto';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidV4 } from 'uuid';

/**
 * 认证服务
 * @remarks 提供管理员认证、JWT 生成等功能
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * 构造函数，注入 AdminService 和 JwtService
   * @param adminService 管理员服务实例
   * @param jwtService JWT 服务实例
   */
  constructor(
    private readonly adminService: AdminService,
    private jwtService: JwtService
  ) {}

  /**
   * 校验管理员身份
   * @param data 管理员认证请求体
   * @returns 校验结果
   */
  public async validateAdmin(
    data: AdminAuthPayLoadDto
  ): Promise<string | null> {
    const admin = await this.adminService.findByName(data.adminName);
    if (!admin) {
      this.logger.warn(`Fail to found admin with ${data.adminName}`);
      return null;
    }
    if (await this.adminService.checkAdminPassWord(admin, data.adminPassword)) {
      const jti = uuidV4();
      const payload = { username: data.adminName, jti };
      const access_token = await this.jwtService.signAsync(payload);
      this.logger.log(`Admin get access_token succeed with ${data.adminName}`);
      this.logger.debug(`Access_token: ${access_token}`);
      return access_token;
    }
    this.logger.warn(`Admin fail to get access_token with ${data.adminName}`);
    return null;
  }
}
