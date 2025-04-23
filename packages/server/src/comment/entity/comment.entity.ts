import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, Int, ID, registerEnumType } from "@nestjs/graphql";
import { ApiProperty, ApiTags } from "@nestjs/swagger";

export enum CommentStatus {
  Pending = 0,
  Approved = 1,
  Abnormal = 2,
}

registerEnumType(CommentStatus, {
  name: "CommentStatus",
  description: "评论状态枚举",
});

@ApiTags("评论表")
@ObjectType()
@Entity("fyn_comment")
export class Comment {
  @ApiProperty({ description: "评论ID" })
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  comment_id!: number;

  @ApiProperty({ description: "评论者用户名", maxLength: 20 })
  @Field(() => String, { nullable: false })
  @Column({ length: 20, nullable: false })
  comment_username!: string;

  @ApiProperty({ description: "评论者邮箱", maxLength: 255, required: false })
  @Field(() => String, { nullable: true })
  @Column({ length: 255, nullable: true })
  comment_email!: string;

  @ApiProperty({ description: "评论者IP" })
  @Field(() => String, { nullable: false })
  @Column({ type: "text", nullable: false })
  comment_ip!: string;

  @ApiProperty({ description: "评论内容" })
  @Field(() => String, { nullable: false })
  @Column({ type: "text", nullable: false })
  comment_content!: string;

  @ApiProperty({ description: "创建时间" })
  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date;

  @ApiProperty({ description: "更新时间" })
  @Field(() => Date, { nullable: true })
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date;

  @ApiProperty({ description: "评论状态", enum: CommentStatus })
  @Field(() => Int, { nullable: false })
  @Column({ type: "smallint", nullable: false, default: CommentStatus.Pending })
  comment_status!: CommentStatus;
}
