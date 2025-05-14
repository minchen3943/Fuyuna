import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AdminResult } from './entity/adminResult.entity';
import { AdminService } from './admin.service';
import { CreateAdminInput, UpdateAdminInput } from './input/admin.input';
import { UseGuards, Headers, Inject, Logger } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/constants';

@Resolver(() => AdminResult)
@UseGuards(JwtAuthGuard)
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  private readonly logger = new Logger(AdminResolver.name);

  /**
   * 获取根据JWT令牌中获取jti
   * @param token JWT令牌
   * @returns jti
   */
  private async setTokenToBlacklist(token: string): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const decoded = this.jwtService.decode(token) as {
      exp: number;
      jti: string;
    };
    if (!decoded || typeof decoded !== 'object' || !('jti' in decoded)) {
      return false;
    }
    try {
      await this.redis.set(
        `blacklist:${decoded.jti}`,
        'revoked',
        'EX',
        decoded.exp - Math.floor(Date.now() / 1000),
      );
      return true;
    } catch (error) {
      this.logger.error('Error setting token to blacklist:', error);
      return false;
    }
  }

  /**
   * 查询所有管理员
   * @returns 管理员结果对象
   */
  @Query(() => AdminResult)
  async getAllAdmin() {
    const result = await this.adminService.findAll();
    if (result) {
      return {
        code: 200,
        message: `Found ${result.length} admins`,
        data: result,
      };
    }
    return { code: 204, message: 'No admins found', data: [] };
  }

  /**
   * 根据ID查询管理员
   * @param id 管理员ID
   * @returns 管理员结果对象
   */
  @Query(() => AdminResult, { nullable: true })
  async getAdminById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.adminService.findById(id);
    if (result) {
      return {
        code: 200,
        message: `Found admin with ID ${id}`,
        data: [result],
      };
    }
    return { code: 204, message: `No admin found with ID ${id}`, data: [] };
  }

  /**
   * 创建管理员
   * @param data 创建管理员的输入参数
   * @returns 管理员结果对象
   */
  @Mutation(() => AdminResult)
  async createAdmin(@Args('data') data: CreateAdminInput) {
    if (!/^[a-zA-Z0-9_]{5,20}$/.test(data.adminName)) {
      return {
        code: 400,
        message:
          'The username must be 5-20 characters long and contain only letters, numbers, or underscores.',
        data: [],
      };
    }
    const result = await this.adminService.create(data);
    if (result) {
      return {
        code: 200,
        message: `Admin created successfully with ID ${result.adminId}`,
        data: [result],
      };
    }
    return { code: 204, message: `Failed to create admin`, data: [] };
  }

  /**
   * 更新管理员信息
   * @param data 更新管理员的输入参数
   * @returns 管理员结果对象
   */
  @Mutation(() => AdminResult)
  async updateAdmin(
    @Args('data') data: UpdateAdminInput,
    @Context('req') req: Request,
  ) {
    if (!(await this.getAdminById(data.adminId))) {
      return null;
    }
    const result = await this.adminService.update(data);
    if (result) {
      const authHeader = (req.headers['authorization'] ??
        req.headers['Authorization']) as string;
      if (await this.setTokenToBlacklist(authHeader.split(' ')[1])) {
        this.logger.log('Token added to blacklist successfully');
      } else {
        this.logger.error('Failed to add token to blacklist');
        return {
          code: 500,
          message: 'Failed to add token to blacklist',
          data: [],
        };
      }
      return {
        code: 200,
        message: `Admin updated successfully with ID ${result.adminId}`,
        data: [result],
      };
    }
    return {
      code: 204,
      message: `Failed to update Admin with ID ${data.adminId}`,
      data: [],
    };
  }

  /**
   * 更新管理员状态
   * @param adminId 管理员ID
   * @param isActive 是否激活
   * @returns 管理员结果对象
   */
  @Mutation(() => AdminResult)
  async updateAdminStatus(
    @Args('adminId', { type: () => Int }) adminId: number,
    @Args('isActive', { type: () => Boolean }) isActive: boolean,
    @Context('req') req: Request,
  ) {
    const result = await this.adminService.updateActive(adminId, isActive);
    if (result) {
      const authHeader = (req.headers['authorization'] ??
        req.headers['Authorization']) as string;
      if (await this.setTokenToBlacklist(authHeader.split(' ')[1])) {
        this.logger.log('Token added to blacklist successfully');
      } else {
        this.logger.error('Failed to add token to blacklist');
        return {
          code: 500,
          message: 'Failed to add token to blacklist',
          data: [],
        };
      }
      return {
        code: 200,
        message: `Admin updated successfully with ID ${adminId}`,
        data: [result],
      };
    }
    return {
      code: 204,
      message: `Failed to update Admin with ID ${adminId}`,
      data: [],
    };
  }

  /**
   * 删除管理员
   * @param adminId 管理员ID
   * @returns 管理员结果对象
   */
  @Mutation(() => AdminResult)
  async deleteAdmin(
    @Args('adminId', { type: () => Int }) adminId: number,
    @Context('req') req: Request,
  ) {
    const result = await this.adminService.remove(adminId);
    if (result === true) {
      const authHeader = (req.headers['authorization'] ??
        req.headers['Authorization']) as string;
      if (await this.setTokenToBlacklist(authHeader.split(' ')[1])) {
        this.logger.log('Token added to blacklist successfully');
      } else {
        this.logger.error('Failed to add token to blacklist');
        return {
          code: 500,
          message: 'Failed to add token to blacklist',
          data: [],
        };
      }
      return {
        code: 200,
        message: `Admin deleted successfully with ID ${adminId}`,
        data: [],
      };
    }
    return {
      code: 204,
      message: `Failed to delete Admin with ID ${adminId}`,
      data: [],
    };
  }
}
