import { Injectable, Logger } from '@nestjs/common';
import { AdminAuthPayLoadDto } from './dto/auth.dto';
import { AdminService } from '../admin/admin.service';
import { JwtService } from '@nestjs/jwt';

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
    private jwtService: JwtService,
  ) {}

  /**
   * 校验管理员身份
   * @param data 管理员认证请求体
   * @returns 校验结果
   */
  public async validateAdmin(
    data: AdminAuthPayLoadDto,
  ): Promise<string | null> {
    if (!(await this.adminService.findByName(data.adminName))) {
      this.logger.error(`Fail to found admin with ${data.adminName}`);
      return null;
    }
    if (await this.adminService.checkAdminPassWord(data)) {
      const payload = { username: data.adminName };
      const access_token = await this.jwtService.signAsync(payload);
      this.logger.log(`Admin get access_token succeed with ${data.adminName}`);
      return access_token;
    }
    this.logger.error(`Admin fail to get access_token with ${data.adminName}`);
    return null;
  }
}
