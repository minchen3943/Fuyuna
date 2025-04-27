import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateAdminInput {
  @Field(() => String, { nullable: false })
  adminName!: string;

  @Field(() => String, { nullable: false })
  adminPassword!: string;
}

@InputType()
export class LoginAdminInput {
  @Field(() => String, { nullable: false })
  adminName!: string;

  @Field(() => String, { nullable: false })
  adminPassword!: string;
}

@InputType()
export class UpdateAdminInput {
  @Field(() => Int)
  adminId!: number;

  @Field(() => String, { nullable: true })
  adminName?: string;

  @Field(() => String, { nullable: true })
  adminPassword?: string;

  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
