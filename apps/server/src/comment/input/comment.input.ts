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
  @Field(() => String, { description: '评论用户名' })
  commentUserName!: string;

  /**
   * 评论邮箱
   */
  @Field(() => String, { nullable: true, description: '评论邮箱' })
  commentEmail?: string;

  /**
   * 评论IP
   */
  @Field(() => String, { description: '评论IP' })
  commentIp!: string;

  /**
   * 评论内容
   */
  @Field(() => String, { description: '评论内容' })
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
  @Field(() => Number, { description: '评论ID' })
  commentId!: number;

  /**
   * 评论用户名
   */
  @Field(() => String, { nullable: true, description: '评论用户名' })
  commentUserName?: string;

  /**
   * 评论邮箱
   */
  @Field(() => String, { nullable: true, description: '评论邮箱' })
  commentEmail?: string;

  /**
   * 评论IP
   */
  @Field(() => String, { nullable: true, description: '评论IP' })
  commentIp?: string;

  /**
   * 评论内容
   */
  @Field(() => String, { nullable: true, description: '评论内容' })
  commentContent?: string;

  /**
   * 评论状态
   */
  @Field(() => CommentStatus, { nullable: true, description: '评论状态' })
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
