import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Comment } from './comment.entity';

@ObjectType()
export class CommentResult {
  @Field(() => Int)
  code!: number;

  @Field()
  message!: string;

  @Field(() => [Comment], { nullable: true })
  data?: Comment[];
}
