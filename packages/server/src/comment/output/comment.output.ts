import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class TotalPages {
  @Field(() => Int)
  code!: number;

  @Field()
  message!: string;

  @Field(() => Int, { nullable: true })
  data?: number;
}
