import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Article } from './article.entity';

/**
 * 文章查询结果对象
 * @remarks 用于封装文章相关的 GraphQL 查询返回结构
 */
@ObjectType()
export class ArticleResult {
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
   * 文章数据列表
   */
  @Field(() => [Article], { nullable: true })
  data?: Article[];
}
