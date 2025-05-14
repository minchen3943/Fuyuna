import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * 评论总页数输出对象
 */
@ObjectType()
export class TotalPagesOutput {
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
   * 总页数数据
   */
  @Field(() => Int, { nullable: true, description: '总页数数据' })
  data?: number;
}
