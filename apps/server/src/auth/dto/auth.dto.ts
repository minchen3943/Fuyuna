import { Field } from '@nestjs/graphql';

/**
 * 管理员认证请求体 DTO
 * @remarks 用于管理员登录的 GraphQL 输入类型
 */
export class AdminAuthPayLoadDto {
  /**
   * 管理员用户名
   */
  @Field(() => String, { nullable: false })
  adminName!: string;

  /**
   * 管理员密码
   */
  @Field(() => String, { nullable: false })
  adminPassword!: string;
}
