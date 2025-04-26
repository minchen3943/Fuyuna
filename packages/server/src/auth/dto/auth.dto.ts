import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

export class AdminAuthPayLoadDto {
  @ApiProperty({ description: '管理员名称', maxLength: 20 })
  @Field(() => String, { nullable: false })
  adminName!: string;

  @ApiProperty({ description: '管理员密码', writeOnly: true })
  @Field(() => String, { nullable: false })
  adminPassword!: string;
}
