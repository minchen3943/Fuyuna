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
  @Field(() => Int, { description: '状态码' })
  code!: number;

  /**
   * 返回消息
   */
  @Field(() => String, { description: '返回消息' })
  message!: string;

  /**
   * 管理员数据列表
   */
  @Field(() => [Admin], { nullable: true, description: '管理员数据列表' })
  data?: Admin[];
}
