import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from './comment.entity';

@ObjectType()
export class CommentResult {
  @ApiProperty({ description: '状态码' })
  @Field(() => Int)
  code!: number;

  @ApiProperty({ description: '提示信息' })
  @Field()
  message!: string;

  @ApiProperty({
    description: '评论数据',
    type: () => Comment,
    required: false,
  })
  @Field(() => [Comment], { nullable: true })
  data?: Comment[];
}
