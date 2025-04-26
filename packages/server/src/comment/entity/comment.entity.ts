import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ObjectType, Field, Int, ID, registerEnumType } from '@nestjs/graphql';
import { ApiProperty, ApiTags } from '@nestjs/swagger';

export enum CommentStatus {
  Pending = 0,
  Approved = 1,
  Abnormal = 2,
}

registerEnumType(CommentStatus, {
  name: 'CommentStatus',
  description: '评论状态枚举',
});

@ApiTags('评论表')
@ObjectType()
@Entity('fyn_comment')
export class Comment {
  @ApiProperty({
    description: '评论ID',
    type: Number,
  })
  @Field(() => ID)
  @PrimaryGeneratedColumn({ name: 'comment_id' })
  commentId!: number;

  @ApiProperty({
    description: '评论者用户名',
    type: String,
    maxLength: 20,
  })
  @Field(() => String, { nullable: false })
  @Column({ length: 20, nullable: false, name: 'comment_username' })
  commentUserName!: string;

  @ApiProperty({
    description: '评论者邮箱',
    type: String,
    maxLength: 255,
    required: false,
  })
  @Field(() => String, { nullable: true })
  @Column({ length: 255, nullable: true, name: 'comment_email' })
  commentEmail!: string;

  @ApiProperty({
    description: '评论者IP',
    type: String,
  })
  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'comment_ip' })
  commentIp!: string;

  @ApiProperty({
    description: '评论内容',
    type: String,
  })
  @Field(() => String, { nullable: false })
  @Column({ type: 'text', nullable: false, name: 'comment_content' })
  commentContent!: string;

  @ApiProperty({
    description: '创建时间',
    type: String,
    format: 'date-time',
  })
  @Field(() => Date, { nullable: true })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  created_at!: Date;

  @ApiProperty({
    description: '更新时间',
    type: String,
    format: 'date-time',
  })
  @Field(() => Date, { nullable: true })
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'updated_at',
  })
  updated_at!: Date;

  @ApiProperty({
    description: '评论状态',
    enum: CommentStatus,
    enumName: 'CommentStatus',
  })
  @Field(() => Int, { nullable: false })
  @Column({
    type: 'smallint',
    nullable: false,
    default: CommentStatus.Pending,
    name: 'comment_status',
  })
  commentStatus!: CommentStatus;
}
