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
  @Field(() => String, { description: '文章标题' })
  article_title!: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String, { description: 'COS 存储桶名称' })
  article_bucket_name!: string;

  /**
   * COS 存储桶区域
   */
  @Field(() => String, { description: 'COS 存储桶区域' })
  article_bucket_region!: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, { description: 'COS 文件 key' })
  article_key!: string;

  /**
   * 文件名
   */
  @Field(() => String, { description: '文件名' })
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
  @Field(() => Int, { description: '文章ID' })
  articleId!: number;

  /**
   * 文章标题
   */
  @Field(() => String, {
    nullable: true,
    description: '文章标题',
  })
  article_title?: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String, {
    nullable: true,
    description: 'COS 存储桶名称',
  })
  article_bucket_name?: string;

  /**
   * COS 存储桶区域
   */
  @Field(() => String, {
    nullable: true,
    description: 'COS 存储桶区域',
  })
  article_bucket_region?: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, {
    nullable: true,
    description: 'COS 文件 key',
  })
  article_key?: string;

  /**
   * 文件名
   */
  @Field(() => String, {
    nullable: true,
    description: '文件名',
  })
  article_name?: string;

  /**
   * 文章状态
   */
  @Field(() => ArticleStatus, {
    nullable: true,
    description: '文章状态',
  })
  article_status?: ArticleStatus;
}

@InputType()
export class DeleteArticleInput {
  /**
   * 文章ID
   */
  @Field(() => Int, { description: '文章ID（删除指定文章）' })
  article_id!: number;
}
