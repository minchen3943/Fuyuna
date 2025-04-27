import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Admin } from './admin.entity';

@ObjectType()
export class AdminResult {
  @Field(() => Int)
  code!: number;

  @Field()
  message!: string;

  @Field(() => [Admin], { nullable: true })
  data?: Admin[];
}
