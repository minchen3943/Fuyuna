import { InputType, Field, Int } from '@nestjs/graphql';

/**
 * 创建管理员输入参数
 */
@InputType()
export class CreateAdminInput {
  /**
   * 管理员名称
   */
  @Field(() => String, { nullable: false })
  adminName!: string;

  /**
   * 管理员密码
   */
  @Field(() => String, { nullable: false })
  adminPassword!: string;
}

/**
 * 管理员登录输入参数
 */
@InputType()
export class LoginAdminInput {
  /**
   * 管理员名称
   */
  @Field(() => String, { nullable: false })
  adminName!: string;

  /**
   * 管理员密码
   */
  @Field(() => String, { nullable: false })
  adminPassword!: string;
}

/**
 * 更新管理员输入参数
 */
@InputType()
export class UpdateAdminInput {
  /**
   * 管理员ID
   */
  @Field(() => Int)
  adminId!: number;

  /**
   * 管理员名称
   */
  @Field(() => String, { nullable: true })
  adminName?: string;

  /**
   * 管理员密码
   */
  @Field(() => String, { nullable: true })
  adminPassword?: string;

  /**
   * 是否激活
   */
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
