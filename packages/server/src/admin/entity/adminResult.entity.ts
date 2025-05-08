import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Admin } from './admin.entity';

/**
 * 管理员结果对象
 */
@ObjectType()
export class AdminResult {
  /**
   * 状态码
   */
  @Field(() => Int)
  code!: number;

  /**
   * 返回消息
   */
  @Field()
  message!: string;

  /**
   * 管理员数据列表
   */
  @Field(() => [Admin], { nullable: true })
  data?: Admin[];
}
