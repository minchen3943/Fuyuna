import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
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
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'article_id' })
  article_id!: number;

  /**
   * 文章标题
   */
  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'article_title' })
  article_title!: string;

  /**
   * COS 存储桶名称
   */
  @Field(() => String, { nullable: false })
  @Column({ length: 50, nullable: false, name: 'article_bucket_name' })
  article_bucket_name!: string;

  /**
   * COS 存储桶所在区域
   */
  @Field(() => String, { nullable: false })
  @Column({ length: 20, nullable: false, name: 'article_bucket_region' })
  article_bucket_region!: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, { nullable: false })
  @Column({ length: 500, nullable: false, name: 'article_key' })
  article_key!: string;

  /**
   * 文件名
   */
  @Field(() => String, { nullable: false })
  @Column({ length: 100, nullable: false, name: 'article_name' })
  article_name!: string;

  /**
   * 创建时间
   */
  @Field(() => Date, { nullable: true })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at!: Date;

  /**
   * 更新时间
   */
  @Field(() => Date, { nullable: true })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updated_at!: Date;

  /**
   * 文章浏览量
   */
  @Field(() => Int, { nullable: false })
  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
    name: 'article_view_count',
  })
  article_view_count!: number;

  /**
   * 文章状态
   */
  @Field(() => Int, { nullable: false })
  @Column({
    type: 'smallint',
    nullable: false,
    default: ArticleStatus.Hidden,
    name: 'article_status',
  })
  article_status!: ArticleStatus;
}
