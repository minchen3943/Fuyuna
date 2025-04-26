import { InputType, Field } from '@nestjs/graphql';
import { CommentStatus } from '../entity/comment.entity';

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  commentUserName!: string;

  @Field(() => String, { nullable: true })
  commentEmail?: string;

  @Field(() => String)
  commentIp!: string;

  @Field(() => String)
  commentContent!: string;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => Number)
  commentId!: number;

  @Field(() => String, { nullable: true })
  commentUserName?: string;

  @Field(() => String, { nullable: true })
  commentEmail?: string;

  @Field(() => String, { nullable: true })
  commentIp?: string;

  @Field(() => String, { nullable: true })
  commentContent?: string;

  @Field(() => CommentStatus, { nullable: true })
  commentStatus?: CommentStatus;
}

@InputType()
export class DeleteCommentInput {
  @Field(() => Number)
  commentId!: number;
}
