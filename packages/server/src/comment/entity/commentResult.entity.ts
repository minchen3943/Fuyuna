import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from './comment.entity';

/**
 * 评论结果对象
 */
@ObjectType()
export class CommentResult {
  /**
   * 状态码
   */
  @Field(() => Int, { description: '状态码' })
  code!: number;

  /**
   * 返回消息
   */
  @Field({ description: '返回消息' })
  message!: string;

  /**
   * 评论数据列表
   */
  @Field(() => [Comment], { nullable: true, description: '评论数据列表' })
  data?: Comment[];
}
