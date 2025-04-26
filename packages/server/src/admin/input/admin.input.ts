import { InputType, Field, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@InputType()
export class CreateAdminInput {
  @ApiProperty({ description: '管理员名称', maxLength: 20 })
  @Field(() => String, { nullable: false })
  adminName!: string;

  @ApiProperty({ description: '管理员密码', writeOnly: true })
  @Field(() => String, { nullable: false })
  adminPassword!: string;
}

@InputType()
export class LoginAdminInput {
  @ApiProperty({ description: '管理员名称', maxLength: 20 })
  @Field(() => String, { nullable: false })
  adminName!: string;

  @ApiProperty({ description: '管理员密码', writeOnly: true })
  @Field(() => String, { nullable: false })
  adminPassword!: string;
}

@InputType()
export class UpdateAdminInput {
  @ApiProperty({ description: '管理员ID' })
  @Field(() => Int)
  adminId!: number;

  @ApiProperty({ description: '管理员名称', required: false, maxLength: 20 })
  @Field(() => String, { nullable: true })
  adminName?: string;

  @ApiProperty({ description: '管理员密码', required: false, writeOnly: true })
  @Field(() => String, { nullable: true })
  adminPassword?: string;

  @ApiProperty({ description: '管理员状态', required: false })
  @Field(() => Boolean, { nullable: true })
  isActive?: boolean;
}
