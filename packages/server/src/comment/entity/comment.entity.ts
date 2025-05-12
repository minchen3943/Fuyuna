import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
  Hidden = 0,
  Public = 1,
  Reviewing = 2,
}

registerEnumType(CommentStatus, {
  name: 'CommentStatus',
  description: '评论状态枚举',
});

/**
 * 评论实体
 */
@ObjectType()
@Entity('fyn_comment')
export class Comment {
  /**
   * 评论ID
   */
  @Field(() => ID, { description: '评论ID' })
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId!: number;

  /**
   * 评论用户名
   */
  @Field(() => String, { nullable: false, description: '评论用户名' })
  @Column({
    length: 20,
    nullable: false,
    name: 'comment_username',
    comment: '评论用户名',
  })
  commentUserName!: string;

  /**
   * 评论邮箱
   */
  @Field(() => String, { nullable: true, description: '评论邮箱' })
  @Column({
    length: 255,
    nullable: true,
    name: 'comment_email',
    comment: '评论邮箱',
  })
  commentEmail!: string;

  /**
   * 评论IP
   */
  @Field(() => String, { nullable: false, description: '评论IP' })
  @Column({
    type: 'text',
    nullable: false,
    name: 'comment_ip',
    comment: '评论IP',
  })
  commentIp!: string;

  /**
   * 评论内容
   */
  @Field(() => String, { nullable: false, description: '评论内容' })
  @Column({
    type: 'text',
    nullable: false,
    name: 'comment_content',
    comment: '评论内容',
  })
  commentContent!: string;

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
   * 评论状态
   */
  @Field(() => Int, { nullable: false, description: '评论状态' })
  @Column({
    type: 'smallint',
    nullable: false,
    default: CommentStatus.Hidden,
    name: 'comment_status',
  })
  commentStatus!: CommentStatus;
}
