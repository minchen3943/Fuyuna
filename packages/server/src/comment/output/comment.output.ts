import { ObjectType, Field, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class TotalPages {
  @ApiProperty({ description: '状态码' })
  @Field(() => Int)
  code!: number;

  @ApiProperty({ description: '提示信息' })
  @Field()
  message!: string;

  @ApiProperty({
    description: '数据',
    type: () => Comment,
    required: false,
  })
  @Field(() => Int, { nullable: true })
  data?: number;
}
