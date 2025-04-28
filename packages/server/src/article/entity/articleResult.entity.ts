import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Article } from './article.entity';

@ObjectType()
export class ArticleResult {
  @Field(() => Int)
  code!: number;

  @Field()
  message!: string;

  @Field(() => [Article], { nullable: true })
  data?: Article[];
}
