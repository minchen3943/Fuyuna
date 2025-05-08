import { InputType, Field } from '@nestjs/graphql';
import { CommentStatus } from '../entity/comment.entity';

/**
 * 创建评论输入参数
 */
@InputType()
export class CreateCommentInput {
  /**
   * 评论用户名
   */
  @Field(() => String)
  commentUserName!: string;

  /**
   * 评论邮箱
   */
  @Field(() => String, { nullable: true })
  commentEmail?: string;

  /**
   * 评论IP
   */
  @Field(() => String)
  commentIp!: string;

  /**
   * 评论内容
   */
  @Field(() => String)
  commentContent!: string;
}

/**
 * 更新评论输入参数
 */
@InputType()
export class UpdateCommentInput {
  /**
   * 评论ID
   */
  @Field(() => Number)
  commentId!: number;

  /**
   * 评论用户名
   */
  @Field(() => String, { nullable: true })
  commentUserName?: string;

  /**
   * 评论邮箱
   */
  @Field(() => String, { nullable: true })
  commentEmail?: string;

  /**
   * 评论IP
   */
  @Field(() => String, { nullable: true })
  commentIp?: string;

  /**
   * 评论内容
   */
  @Field(() => String, { nullable: true })
  commentContent?: string;

  /**
   * 评论状态
   */
  @Field(() => CommentStatus, { nullable: true })
  commentStatus?: CommentStatus;
}

/**
 * 删除评论输入参数
 */
@InputType()
export class DeleteCommentInput {
  /**
   * 评论ID
   */
  @Field(() => Number)
  commentId!: number;
}
