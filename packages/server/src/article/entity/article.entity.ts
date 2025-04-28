import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { registerEnumType } from '@nestjs/graphql';

export enum ArticleStatus {
  Hidden = 0,
  Public = 1,
  Reviewing = 2,
}

registerEnumType(ArticleStatus, {
  name: 'ArticleStatus',
  description: '文章状态枚举',
});

@ObjectType()
@Entity('fyn_article')
export class Article {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'article_id' })
  article_id!: number;

  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'article_title' })
  article_title!: string;

  @Field(() => String, { nullable: false })
  @Column({ length: 50, nullable: false, name: 'article_bucket_name' })
  article_bucket_name!: string;

  @Field(() => String, { nullable: false })
  @Column({ length: 20, nullable: false, name: 'article_bucket_region' })
  article_bucket_region!: string;

  @Field(() => String, { nullable: false })
  @Column({ length: 500, nullable: false, name: 'article_key' })
  article_key!: string;

  @Field(() => String, { nullable: false })
  @Column({ length: 100, nullable: false, name: 'article_name' })
  article_name!: string;

  @Field(() => Date, { nullable: true })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at!: Date;

  @Field(() => Date, { nullable: true })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updated_at!: Date;

  @Field(() => Int, { nullable: false })
  @Column({
    type: 'integer',
    nullable: false,
    default: 0,
    name: 'article_view_count',
  })
  article_view_count!: number;

  @Field(() => Int, { nullable: false })
  @Column({
    type: 'smallint',
    nullable: false,
    default: ArticleStatus.Hidden,
    name: 'article_status',
  })
  article_status!: ArticleStatus;
}
