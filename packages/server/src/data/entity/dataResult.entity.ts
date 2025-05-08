import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Data } from './data.entity';

/**
 * 网站数据查询结果对象
 * @remarks 用于封装网站数据相关的 GraphQL 查询返回结构
 */
@ObjectType()
export class DataResult {
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
   *网站数据值
   */
  @Field(() => Int, { nullable: true, description: '网站数据值' })
  data?: number;
}

/**
 * 网站访问量查询结果对象
 * @remarks 用于封装网站访问量相关的 GraphQL 查询返回结构
 */
@ObjectType()
export class AllDataResult {
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
   * 网站数据对象
   */
  @Field(() => Data, { nullable: true, description: '网站数据对象' })
  data?: Data;
}
