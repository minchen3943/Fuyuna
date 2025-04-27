import { Field } from '@nestjs/graphql';

export class AdminAuthPayLoadDto {
  @Field(() => String, { nullable: false })
  adminName!: string;

  @Field(() => String, { nullable: false })
  adminPassword!: string;
}
