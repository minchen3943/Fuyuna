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
 * 友情链接状态枚举
 * @enum {number}
 * @property {number} Hidden - 隐藏
 * @property {number} Public - 公开
 * @property {number} Reviewing - 审核中
 */
export enum FriendLinkStatus {
  Hidden = 0,
  Public = 1,
  Reviewing = 2,
}

registerEnumType(FriendLinkStatus, {
  name: 'FriendLinkStatus',
  description: '友情链接状态枚举',
});

export class PutFriendLinkLogoRequiredInput {
  /**
   * COS 存储桶名称
   */
  @Field(() => String, { nullable: false, description: 'COS 存储桶名称' })
  @Column({
    length: 50,
    nullable: false,
    name: 'link_image_bucket_name',
    comment: 'COS 存储桶名称',
  })
  link_image_bucket_name!: string;

  /**
   * COS 存储桶所在区域
   */
  @Field(() => String, { nullable: false, description: 'COS 存储桶所在区域' })
  @Column({
    length: 20,
    nullable: false,
    name: 'link_image_bucket_region',
    comment: 'COS 存储桶所在区域',
  })
  link_image_bucket_region!: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, { nullable: false, description: 'COS 文件 key' })
  @Column({
    length: 500,
    nullable: false,
    name: 'link_image_bucket_key',
    comment: 'COS 文件 key',
  })
  link_image_bucket_key!: string;
}

export class PutFriendLinkLogo {
  /**
   * COS 存储桶名称
   */
  @Field(() => String, { nullable: true, description: 'COS 存储桶名称' })
  @Column({
    length: 50,
    nullable: true,
    name: 'link_image_bucket_name',
    comment: 'COS 存储桶名称',
  })
  link_image_bucket_name?: string;

  /**
   * COS 存储桶所在区域
   */
  @Field(() => String, { nullable: true, description: 'COS 存储桶所在区域' })
  @Column({
    length: 20,
    nullable: true,
    name: 'link_image_bucket_region',
    comment: 'COS 存储桶所在区域',
  })
  link_image_bucket_region?: string;

  /**
   * COS 文件 key
   */
  @Field(() => String, { nullable: true, description: 'COS 文件 key' })
  @Column({
    length: 500,
    nullable: true,
    name: 'link_image_bucket_key',
    comment: 'COS 文件 key',
  })
  link_image_bucket_key?: string;
}

/**
 * 友情链接实体类，对应数据库表 fyn_friend_link
 */
@ObjectType()
@Entity('fyn_friend_link')
export class FriendLink extends PutFriendLinkLogoRequiredInput {
  /**
   * 链接ID
   */
  @Field(() => ID, { description: '链接ID' })
  @PrimaryGeneratedColumn({ name: 'link_id' })
  link_id!: number;

  /**
   * 链接标题
   */
  @Field(() => String, { description: '链接标题' })
  @Column({
    type: 'varchar',
    length: 100,
    name: 'link_title',
    nullable: false,
    comment: '链接标题',
  })
  link_title!: string;

  /**
   * URL地址
   */
  @Field(() => String, { description: 'URL地址' })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'link_url',
    nullable: false,
    comment: 'URL地址',
  })
  link_url!: string;

  /**
   * 链接描述（100字符内）
   */
  @Field(() => String, { nullable: true, description: '链接描述' })
  @Column({
    type: 'text',
    name: 'link_description',
    nullable: true,
    comment: '链接描述',
  })
  link_description?: string;

  /**
   * 创建时间
   */
  @Field(() => Date, { description: '创建时间' })
  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '创建时间',
  })
  created_at!: Date;

  /**
   * 最后修改时间
   */
  @Field(() => Date, { description: '最后修改时间' })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '最后修改时间',
  })
  updated_at!: Date;

  /**
   * 友链状态
   */
  @Field(() => Int, { description: '友链状态' })
  @Column({
    type: 'smallint',
    name: 'link_status',
    default: FriendLinkStatus.Hidden,
    comment: '友链状态',
  })
  link_status!: FriendLinkStatus;
}
