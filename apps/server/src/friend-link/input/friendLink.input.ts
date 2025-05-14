import { InputType, Field, Int } from '@nestjs/graphql';
import {
  FriendLinkStatus,
  PutFriendLinkLogo,
} from '../entity/friendLink.entity';

/**
 * 创建友链输入类型
 * @remarks 创建友链接口的数据传输对象
 */
@InputType()
export class CreateFriendLinkInput extends PutFriendLinkLogo {
  /**
   * 友链标题
   */
  @Field(() => String, { nullable: false, description: '友链标题' })
  linkTitle!: string;

  /**
   * URL地址
   */
  @Field(() => String, { nullable: false, description: 'URL地址' })
  linkUrl!: string;

  /**
   * 链接描述
   */
  @Field(() => String, { nullable: true, description: '链接描述' })
  linkDescription?: string;

  /**
   * 友链状态
   */
  @Field(() => Int, { nullable: false, description: '友链状态' })
  linkStatus!: FriendLinkStatus;
}

/**
 * 更新友链输入类型
 * @remarks 更新友链接口的数据传输对象
 */
@InputType()
export class UpdateFriendLinkInput extends PutFriendLinkLogo {
  /**
   * 友链ID
   */
  @Field(() => Int, { nullable: false, description: '友链ID' })
  linkId!: number;

  /**
   * 友链标题
   */
  @Field(() => String, { nullable: true, description: '友链标题' })
  linkTitle?: string;

  /**
   * URL地址
   */
  @Field(() => String, { nullable: true, description: 'URL地址' })
  linkUrl?: string;

  /**
   * 链接描述
   */
  @Field(() => String, { nullable: true, description: '链接描述' })
  linkDescription?: string;

  /**
   * 友链状态
   */
  @Field(() => Int, { nullable: true, description: '友链状态' })
  linkStatus?: FriendLinkStatus;
}
