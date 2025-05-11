import { ObjectType, Field, Int } from '@nestjs/graphql';
import { FriendLink } from './friendLink.entity';

/**
 * 友链查询结果对象
 * @remarks 用于封装友链相关的 GraphQL 查询返回结构
 */
@ObjectType()
export class FriendLinkResult {
  /**
   * 状态码
   */
  @Field(() => Int, { description: '状态码' })
  code!: number;

  /**
   * 返回消息
   */
  @Field({ description: '返回消息' })
  message!: string;

  /**
   * 友链数据列表
   */
  @Field(() => [FriendLink], { nullable: true, description: '友链数据列表' })
  data?: FriendLink[];
}
