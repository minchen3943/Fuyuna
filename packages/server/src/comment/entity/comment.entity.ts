import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
  Pending = 0,
  Approved = 1,
  Abnormal = 2,
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
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId!: number;

  /**
   * 评论用户名
   */
  @Field(() => String, { nullable: false })
  @Column({ length: 20, nullable: false, name: 'comment_username' })
  commentUserName!: string;

  /**
   * 评论邮箱
   */
  @Field(() => String, { nullable: true })
  @Column({ length: 255, nullable: true, name: 'comment_email' })
  commentEmail!: string;

  /**
   * 评论IP
   */
  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'comment_ip' })
  commentIp!: string;

  /**
   * 评论内容
   */
  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'comment_content' })
  commentContent!: string;

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
   * 评论状态
   */
  @Field(() => Int, { nullable: false })
  @Column({
    type: 'smallint',
    nullable: false,
    default: CommentStatus.Pending,
    name: 'comment_status',
  })
  commentStatus!: CommentStatus;
}
