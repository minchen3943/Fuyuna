import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FriendLinkService } from './friend-link.service';
import { UpdateFriendLinkInput } from './input/friendLink.input';
import { TotalPages } from '../article/output/article.output';
import { FriendLinkResult } from './entity/friendLinkResult.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FriendLinkStatus } from './entity/friendLink.entity';
import { TencentCosService } from 'src/tencent-cos/tencent-cos.service';

@Resolver(() => FriendLinkResult)
export class FriendLinkResolver {
  constructor(
    private readonly friendLinkService: FriendLinkService,
    private readonly tencentCosService: TencentCosService,
  ) {}

  @Query(() => FriendLinkResult)
  /**
   * 查询所有友链
   * @returns 返回包含所有友链的结果对象
   */
  async getAllFriendLink() {
    const result = await this.friendLinkService.findAll();
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} friend links`,
        data: result,
      };
    }
    return { code: 204, message: 'No friend links found', data: [] };
  }

  @Query(() => FriendLinkResult)
  /**
   * 根据页码和每页数量查询友链
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 返回指定页码的友链结果对象
   */
  async getFriendLinkByPage(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    const result = await this.friendLinkService.findByPage(page, pageSize);
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} friend links on page ${page}`,
        data: result,
      };
    }
    return {
      code: 204,
      message: `No friend links found on page ${page}`,
      data: [],
    };
  }

  @Query(() => TotalPages)
  /**
   * 获取友链的总页数
   * @param pageSize 每页数量
   * @returns 返回总页数的结果对象
   */
  async getFriendLinkTotalPages(
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    if (pageSize <= 0) {
      return {
        code: 400,
        message: 'Page size must be greater than 0',
        data: null,
      };
    }
    const result = await this.friendLinkService.getTotalPages(pageSize);
    return {
      code: 200,
      message: `Total pages: ${result.totalPages} for page size ${pageSize}`,
      data: result.totalPages,
    };
  }

  @Query(() => FriendLinkResult, { nullable: true })
  /**
   * 根据友链ID查询友链
   * @param friend_link_id 友链ID
   * @returns 返回指定ID的友链结果对象
   */
  async getFriendLinkById(
    @Args('friend_link_id', { type: () => Int }) friendLinkId: number,
  ) {
    const result = await this.friendLinkService.findById(friendLinkId);
    if (result) {
      return {
        code: 200,
        message: `Found friend link with ID ${friendLinkId}`,
        data: [result],
      };
    }
    return {
      code: 204,
      message: `No friend link found with ID ${friendLinkId}`,
      data: null,
    };
  }

  @Mutation(() => FriendLinkResult)
  @UseGuards(JwtAuthGuard)
  /**
   * 更新友链信息
   * @param data 更新友链的输入数据
   * @returns 返回更新成功的友链结果对象
   */
  async updateFriendLink(@Args('input') data: UpdateFriendLinkInput) {
    if (
      data.linkStatus &&
      (typeof data.linkStatus !== 'number' ||
        !Object.values(FriendLinkStatus).includes(data.linkStatus))
    ) {
      return {
        code: 400,
        message: 'Invalid link_status value',
        data: null,
      };
    }
    const result = await this.friendLinkService.updateFriendLink(
      data.linkId,
      data,
    );

    if (result) {
      return {
        code: 200,
        message: `Friend link updated successfully with ID ${result.linkId}`,
        data: [result],
      };
    }

    return {
      code: 204,
      message: `Failed to update friend link with ID ${data.linkId}`,
      data: null,
    };
  }

  @Mutation(() => FriendLinkResult)
  @UseGuards(JwtAuthGuard)
  /**
   * 更新友链状态
   * @param friend_link_id 友链ID
   * @param link_status 友链状态
   * @returns 返回更新成功的友链状态结果对象
   */
  async updateFriendLinkStatus(
    @Args('friend_link_id', { type: () => Int }) friendLinkId: number,
    @Args('friend_link_status', { type: () => Int }) friendLinkStatus: number,
  ) {
    if (
      typeof friendLinkStatus !== 'number' ||
      !Object.values(FriendLinkStatus).includes(friendLinkStatus)
    ) {
      return {
        code: 400,
        message: 'Invalid link_status value',
        data: null,
      };
    }
    const result = await this.friendLinkService.updateStatus(
      friendLinkId,
      friendLinkStatus,
    );

    if (result) {
      return {
        code: 200,
        message: `Friend link status updated successfully with ID ${friendLinkId}`,
        data: [result],
      };
    }

    return {
      code: 204,
      message: `Failed to update friend link status with ID ${friendLinkId}`,
      data: null,
    };
  }

  @Mutation(() => FriendLinkResult)
  @UseGuards(JwtAuthGuard)
  /**
   * 删除友链
   * @param link_id 友链ID
   * @returns 返回删除成功的结果对象
   */
  async deleteFriendLink(
    @Args('friend_link_id', { type: () => Int }) friendLinkId: number,
  ) {
    const friendLink = await this.friendLinkService.findById(friendLinkId);
    if (!friendLink) {
      return {
        code: 204,
        message: `No friend link found with ID ${friendLinkId}`,
        data: null,
      };
    }

    if (
      friendLink.linkImageBucketKey &&
      friendLink.linkImageBucketRegion &&
      friendLink.linkImageBucketName
    ) {
      await this.tencentCosService.delObject({
        Region: friendLink.linkImageBucketRegion,
        Bucket: friendLink.linkImageBucketName,
        Key: friendLink.linkImageBucketKey,
      });
    }

    const result = await this.friendLinkService.deleteFriendLink(friendLinkId);

    if (result === true) {
      return {
        code: 200,
        message: `Friend link deleted successfully with ID ${friendLinkId}`,
        data: null,
      };
    }

    return {
      code: 204,
      message: `Failed to delete friend link with ID ${friendLinkId}`,
      data: null,
    };
  }
}
