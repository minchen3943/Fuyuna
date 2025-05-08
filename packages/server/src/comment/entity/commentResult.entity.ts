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
  @Field(() => Int)
  code!: number;

  /**
   * 返回消息
   */
  @Field()
  message!: string;

  /**
   * 评论数据列表
   */
  @Field(() => [Comment], { nullable: true })
  data?: Comment[];
}
