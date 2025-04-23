import { InputType, Field } from "@nestjs/graphql";
import { CommentStatus } from "../entity/comment.entity";

@InputType()
export class CreateCommentInput {
  @Field(() => String)
  comment_username!: string;

  @Field(() => String, { nullable: true })
  comment_email?: string;

  @Field(() => String)
  comment_ip!: string;

  @Field(() => String)
  comment_content!: string;
}

@InputType()
export class UpdateCommentInput {
  @Field(() => Number)
  comment_id!: number;

  @Field(() => String, { nullable: true })
  comment_username?: string;

  @Field(() => String, { nullable: true })
  comment_email?: string;

  @Field(() => String, { nullable: true })
  comment_ip?: string;

  @Field(() => String, { nullable: true })
  comment_content?: string;

  @Field(() => CommentStatus, { nullable: true })
  comment_status?: CommentStatus;
}

@InputType()
export class DeleteCommentInput {
  @Field(() => Number)
  comment_id!: number;
}
