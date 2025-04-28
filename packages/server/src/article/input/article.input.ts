import { InputType, Field, Int } from '@nestjs/graphql';
import { ArticleStatus } from '../entity/article.entity';

@InputType()
export class CreateArticleInput {
  @Field(() => String)
  article_title!: string;

  @Field(() => String)
  article_bucket_name!: string;

  @Field(() => String)
  article_bucket_region!: string;

  @Field(() => String)
  article_key!: string;

  @Field(() => String)
  article_name!: string;
}

@InputType()
export class UpdateArticleInput {
  @Field(() => Int)
  article_id!: number;

  @Field(() => String, { nullable: true })
  article_title?: string;

  @Field(() => String, { nullable: true })
  article_bucket_name?: string;

  @Field(() => String, { nullable: true })
  article_bucket_region?: string;

  @Field(() => String, { nullable: true })
  article_key?: string;

  @Field(() => String, { nullable: true })
  article_name?: string;

  @Field(() => ArticleStatus, { nullable: true })
  article_status?: ArticleStatus;
}

@InputType()
export class DeleteArticleInput {
  @Field(() => Int)
  article_id!: number;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true })
  page: number = 1;

  @Field(() => Int, { nullable: true })
  pageSize: number = 10;
}
