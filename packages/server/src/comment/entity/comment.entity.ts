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

@ObjectType()
@Entity('fyn_comment')
export class Comment {
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId!: number;

  @Field(() => String, { nullable: false })
  @Column({ length: 20, nullable: false, name: 'comment_username' })
  commentUserName!: string;

  @Field(() => String, { nullable: true })
  @Column({ length: 255, nullable: true, name: 'comment_email' })
  commentEmail!: string;

  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'comment_ip' })
  commentIp!: string;

  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'comment_content' })
  commentContent!: string;

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
    type: 'smallint',
    nullable: false,
    default: CommentStatus.Pending,
    name: 'comment_status',
  })
  commentStatus!: CommentStatus;
}
