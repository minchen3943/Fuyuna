import { ObjectType, Field, Int } from '@nestjs/graphql';

/**
 * 文章分页总页数输出对象
 * @remarks 用于封装分页查询时的总页数返回结构
 */
@ObjectType()
export class TotalPages {
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
   * 总页数
   */
  @Field(() => Int, { nullable: true })
  data?: number;
}
