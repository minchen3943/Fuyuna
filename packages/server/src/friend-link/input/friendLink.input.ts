import { InputType, Field, Int } from '@nestjs/graphql';

/**
 * 更新友链输入类型
 * @remarks 用于 GraphQL 更新友链接口的数据传输对象
 */
@InputType()
export class UpdateFriendLinkInput {
  /**
   * 友链ID
   */
  @Field(() => Int, { nullable: false, description: '友链ID' })
  linkId!: number;

  /**
   * 友链名称
   */
  @Field(() => String, { nullable: true, description: '友链名称' })
  link_name?: string;

  /**
   * 友链地址
   */
  @Field(() => String, { nullable: true, description: '友链地址' })
  link_url?: string;

  /**
   * 友链Logo
   */
  @Field(() => String, { nullable: true, description: '友链Logo' })
  link_logo?: string;

  /**
   * 友链描述
   */
  @Field(() => String, { nullable: true, description: '友链描述' })
  link_desc?: string;

  /**
   * 友链状态
   */
  @Field(() => Int, { nullable: true, description: '友链状态' })
  link_status?: number;
}
