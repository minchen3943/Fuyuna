import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminResult } from './entity/adminResult.entity';
import { AdminService } from './admin.service';
import { CreateAdminInput, UpdateAdminInput } from './input/admin.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Resolver(() => AdminResult)
@UseGuards(JwtAuthGuard)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

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
  async updateAdmin(@Args('data') data: UpdateAdminInput) {
    if (!(await this.getAdminById(data.adminId))) {
      return null;
    }
    const result = await this.adminService.update(data);
    if (result) {
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
  ) {
    const result = await this.adminService.updateActive(adminId, isActive);
    return {
      code: 200,
      message: `Admin updated successfully with ID ${adminId}`,
      data: [result],
    };
  }

  /**
   * 删除管理员
   * @param adminId 管理员ID
   * @returns 管理员结果对象
   */
  @Mutation(() => AdminResult)
  async deleteAdmin(@Args('adminId', { type: () => Int }) adminId: number) {
    const result = await this.adminService.remove(adminId);
    if (result === true) {
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
