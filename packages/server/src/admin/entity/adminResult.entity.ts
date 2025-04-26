import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { Admin } from './admin.entity';

@ObjectType()
export class AdminResult {
  @ApiProperty({ description: '状态码', example: 200 })
  @Field(() => Int)
  code!: number;

  @ApiProperty({ description: '提示信息', example: 'Success' })
  @Field()
  message!: string;

  @ApiProperty({
    description: '管理员数据',
    type: () => Admin,
    required: false,
  })
  @Field(() => Admin, { nullable: true })
  data?: Admin;
}
