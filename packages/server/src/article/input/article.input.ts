import { InputType, Field, Int } from '@nestjs/graphql';
import { ArticleStatus } from '../entity/article.entity';

/**
 * 创建文章输入类型
 * @remarks 用于 GraphQL 创建文章接口的数据传输对象
 */
@InputType()
export class CreateArticleInput {
  /**
   * 文章标题
   */
  @Field(() => String)
  article_title!: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String)
  article_bucket_name!: string;

  /**
   * COS 存储桶区域
   */
  @Field(() => String)
  article_bucket_region!: string;

  /**
   * COS 文件 key
   */
  @Field(() => String)
  article_key!: string;

  /**
   * 文件名
   */
  @Field(() => String)
  article_name!: string;
}

/**
 * 更新文章输入类型
 * @remarks 用于 GraphQL 更新文章接口的数据传输对象
 */
@InputType()
export class UpdateArticleInput {
  /**
   * 文章ID
   */
  @Field(() => Int)
  article_id!: number;

  /**
   * 文章标题
   */
  @Field(() => String, { nullable: true })
  article_title?: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String, { nullable: true })
  article_bucket_name?: string;

  /**
   * COS 存储桶区域
   */
  @Field(() => String, { nullable: true })
  article_bucket_region?: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, { nullable: true })
  article_key?: string;

  /**
   * 文件名
   */
  @Field(() => String, { nullable: true })
  article_name?: string;

  /**
   * 文章状态
   */
  @Field(() => ArticleStatus, { nullable: true })
  article_status?: ArticleStatus;
}

@InputType()
export class DeleteArticleInput {
  @Field(() => Int)
  article_id!: number;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  page: number = 1;

  @Field(() => Int, { nullable: true })
  pageSize: number = 10;
}
