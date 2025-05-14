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
  articleTitle!: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String, { description: 'COS 存储桶名称' })
  articleBucketName!: string;

  /**
   * COS 存储桶区域
   */
  @Field(() => String, { description: 'COS 存储桶区域' })
  articleBucketRegion!: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, { description: 'COS 文件 key' })
  articleBucketKey!: string;
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
  articleTitle?: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String, {
    nullable: true,
    description: 'COS 存储桶名称',
  })
  articleBucketName?: string;

  /**
   * COS 存储桶区域
   */
  @Field(() => String, {
    nullable: true,
    description: 'COS 存储桶区域',
  })
  articleBucketRegion?: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, {
    nullable: true,
    description: 'COS 文件 key',
  })
  articleBucketKey?: string;

  /**
   * 文章状态
   */
  @Field(() => ArticleStatus, {
    nullable: true,
    description: '文章状态',
  })
  articleStatus?: ArticleStatus;
}

@InputType()
export class DeleteArticleInput {
  /**
   * 文章ID
   */
  @Field(() => Int, { description: '文章ID' })
  articleId!: number;
}
