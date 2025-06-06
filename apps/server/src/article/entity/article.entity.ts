import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { registerEnumType } from '@nestjs/graphql';

/**
 * 文章状态枚举
 * @enum {number}
 * @property {number} Hidden - 隐藏
 * @property {number} Public - 公开
 * @property {number} Reviewing - 审核中
 */
export enum ArticleStatus {
  Hidden = 0,
  Public = 1,
  Reviewing = 2,
}

registerEnumType(ArticleStatus, {
  name: 'ArticleStatus',
  description: '文章状态枚举',
});

/**
 * 文章实体类，对应数据库表 fyn_article
 * @remarks 用于存储文章的所有核心信息
 */
@ObjectType()
@Entity('fyn_article')
export class Article {
  /**
   * 文章ID
   */
  @Field(() => ID, { description: '文章ID' })
  @PrimaryGeneratedColumn({ name: 'article_id' })
  articleId!: number;

  /**
   * 文章标题
   */
  @Field(() => String, { nullable: false, description: '文章标题' })
  @Column({
    type: 'text',
    nullable: false,
    name: 'article_title',
    comment: '文章标题',
  })
  articleTitle!: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String, { nullable: false, description: 'COS 存储桶名称' })
  @Column({
    length: 50,
    nullable: false,
    name: 'article_bucket_name',
    comment: 'COS 存储桶名称',
  })
  articleBucketName!: string;

  /**
   * COS 存储桶所在区域
   */
  @Field(() => String, { nullable: false, description: 'COS 存储桶所在区域' })
  @Column({
    length: 20,
    nullable: false,
    name: 'article_bucket_region',
    comment: 'COS 存储桶所在区域',
  })
  articleBucketRegion!: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, { nullable: false, description: 'COS 文件 key' })
  @Column({
    length: 500,
    nullable: false,
    name: 'article_bucket_key',
    comment: 'COS 文件 key',
  })
  articleBucketKey!: string;

  /**
   * 创建时间
   */
  @Field(() => Date, { nullable: true, description: '创建时间' })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  createdAt!: Date;

  /**
   * 最后更新时间
   */
  @Field(() => Date, { nullable: true, description: '最后更新时间' })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '最后更新时间',
  })
  updatedAt!: Date;

  /**
   * 文章浏览量
   */
  @Field(() => Int, { nullable: false, description: '文章浏览量' })
  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
    name: 'article_view_count',
  })
  articleViewCount!: number;

  /**
   * 文章状态
   */
  @Field(() => Int, { nullable: false, description: '文章状态' })
  @Column({
    type: 'smallint',
    nullable: false,
    default: ArticleStatus.Hidden,
    name: 'article_status',
  })
  articleStatus!: ArticleStatus;
}
