import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * 评论总页数输出对象
 */
@ObjectType()
export class TotalPagesOutput {
  /**
   * 状态码
   */
  @Field(() => Int)
  code!: number;

  /**
   * 返回消息
   */
  @Field()
  message!: string;

  /**
   * 总页数数据
   */
  @Field(() => Int, { nullable: true })
  data?: number;
}
