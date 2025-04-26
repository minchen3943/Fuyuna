import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AdminResult } from './entity/adminResult.entity';
import { AdminService } from './admin.service';
import {
  CreateAdminInput,
  LoginAdminInput,
  UpdateAdminInput,
} from './input/admin.input';

@Resolver(() => AdminResult)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => AdminResult)
  async findAllAdmin() {
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

  @Query(() => AdminResult, { nullable: true })
  async findAdminById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.adminService.findById(id);
    if (result) {
      return {
        code: 200,
        message: `Found admin with ID ${id}`,
        data: result,
      };
    }
    return { code: 204, message: `No admin found with ID ${id}`, data: null };
  }

  @Mutation(() => AdminResult)
  async createAdmin(@Args('data') data: CreateAdminInput) {
    if (!/^[a-zA-Z0-9_]{5,20}$/.test(data.adminName)) {
      return {
        code: 400,
        message:
          'The username must be 5-20 characters long and contain only letters, numbers, or underscores.',
        data: null,
      };
    }
    const result = await this.adminService.create(data);
    if (result) {
      return {
        code: 200,
        message: `Admin created successfully with ID ${result.adminId}`,
        data: result,
      };
    }
    return { code: 204, message: `Failed to create admin`, data: null };
  }

  @Mutation(() => AdminResult)
  async updateAdmin(@Args('data') data: UpdateAdminInput) {
    const result = await this.adminService.update(data);
    if (result) {
      return {
        code: 200,
        message: `Admin updated successfully with ID ${result.adminId}`,
        data: result,
      };
    }
    return {
      code: 204,
      message: `Failed to update Admin with ID ${data.adminId}`,
      data: null,
    };
  }

  @Mutation(() => AdminResult)
  async updateAdminStatus(
    @Args('adminId', { type: () => Int }) adminId: number,
    @Args('isActive', { type: () => Boolean }) isActive: boolean,
  ) {
    const result = await this.adminService.updateActive(adminId, isActive);
    return {
      code: 200,
      message: `Admin updated successfully with ID ${adminId}`,
      data: result,
    };
  }

  @Mutation(() => AdminResult)
  async deleteAdmin(@Args('adminId', { type: () => Int }) adminId: number) {
    const result = await this.adminService.remove(adminId);
    if (result === true) {
      return {
        code: 200,
        message: `Admin deleted successfully with ID ${adminId}`,
        data: null,
      };
    }
    return {
      code: 204,
      message: `Failed to delete Admin with ID ${adminId}`,
      data: null,
    };
  }

  @Mutation(() => AdminResult)
  async checkAdminPassWord(@Args('data') data: LoginAdminInput) {
    const result = await this.adminService.checkAdminPassWord(data);
    if (result === true) {
      return {
        code: 200,
        message: `Admin password is correct`,
        data: null,
      };
    }
    return {
      code: 401,
      message: `Admin name or password is incorrect`,
      data: null,
    };
  }
}
