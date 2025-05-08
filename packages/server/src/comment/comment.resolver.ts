import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput, UpdateCommentInput } from './input/comment.input';
import { TotalPagesOutput } from './output/comment.output';
import { CommentResult } from './entity/commentResult.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentStatus } from './entity/comment.entity';

/**
 * 评论 GraphQL 解析器
 * @remarks 提供评论相关的查询与变更接口
 */
@Resolver(() => CommentResult)
export class CommentResolver {
  /**
   * 构造函数，注入 CommentService
   * @param commentService 评论服务实例
   */
  constructor(private readonly commentService: CommentService) {}

  /**
   * 查询所有评论
   * @returns 评论结果对象
   */
  @Query(() => CommentResult)
  async findAllComment() {
    const result = await this.commentService.findAll();
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} comments`,
        data: result,
      };
    }
    return { code: 204, message: 'No comments found', data: [] };
  }

  /**
   * 分页查询评论
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 评论结果对象
   */
  @Query(() => CommentResult)
  async findCommentByPage(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    const result = await this.commentService.findByPage(page, pageSize);
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} comments on page ${page}`,
        data: result,
      };
    }
    return {
      code: 204,
      message: `No comments found on page ${page}`,
      data: [],
    };
  }

  /**
   * 获取评论总页数
   * @param pageSize 每页数量
   * @returns 总页数输出对象
   */
  @Query(() => TotalPagesOutput)
  async getCommentTotalPages(
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    if (pageSize <= 0) {
      return {
        code: 400,
        message: 'Invalid pageSize value, Page size must be greater than 0',
        data: [],
      };
    }
    const result = await this.commentService.getTotalPages(pageSize);
    if (result) {
      return {
        code: 200,
        message: 'Total pages calculated',
        data: result.totalPages,
      };
    }
    return { code: 204, message: 'No comments found', data: [] };
  }

  /**
   * 根据 ID 查询单个评论
   * @param id 评论ID
   * @returns 评论结果对象
   */
  @Query(() => CommentResult, { nullable: true })
  async findCommentById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.commentService.findById(id);
    if (result) {
      return {
        code: 200,
        message: `Found comment with ID ${id}`,
        data: [result],
      };
    }
    return { code: 204, message: `No comment found with ID ${id}`, data: [] };
  }

  /**
   * 创建新评论
   * @param input 创建评论输入对象
   * @returns 评论结果对象
   */
  @Mutation(() => CommentResult)
  async createComment(@Args('input') input: CreateCommentInput) {
    const result = await this.commentService.create(input);
    if (result) {
      return {
        code: 200,
        message: `Comment created successfully with ID ${result.commentId}`,
        data: [result],
      };
    }
    return { code: 400, message: 'Failed to create comment', data: [] };
  }

  /**
   * 更新评论内容
   * @param data 更新评论输入对象
   * @returns 评论结果对象
   */
  @Mutation(() => CommentResult)
  @UseGuards(JwtAuthGuard)
  async updateComment(@Args('input') data: UpdateCommentInput) {
    if (
      typeof data.commentStatus !== 'number' ||
      !Object.values(CommentStatus).includes(data.commentStatus)
    ) {
      return {
        code: 400,
        message: 'Invalid comment_status value',
        data: null,
      };
    }
    const result = await this.commentService.update(data);
    if (result) {
      return {
        code: 200,
        message: `Comment updated successfully with ID ${result.commentId}`,
        data: [result],
      };
    }
    return {
      code: 204,
      message: `Failed to update comment with ID ${data.commentId}`,
      data: [],
    };
  }

  /**
   * 更新评论状态
   * @param comment_id 评论ID
   * @param comment_status 新状态值
   * @returns 评论结果对象
   */
  @Mutation(() => CommentResult)
  @UseGuards(JwtAuthGuard)
  async updateCommentStatus(
    @Args('comment_id', { type: () => Int }) comment_id: number,
    @Args('comment_status', { type: () => Int }) comment_status: number,
  ) {
    if (
      typeof comment_status !== 'number' ||
      !Object.values(CommentStatus).includes(comment_status)
    ) {
      return {
        code: 400,
        message: 'Invalid comment_status value',
        data: null,
      };
    }
    const result = await this.commentService.updateStatus(
      comment_id,
      comment_status,
    );
    if (result) {
      return {
        code: 200,
        message: `Comment status updated successfully with ID ${comment_id}`,
        data: [result],
      };
    }
    return { code: 400, message: 'Failed to update comment status', data: [] };
  }

  /**
   * 删除评论
   * @param comment_id 评论ID
   * @returns 评论结果对象
   */
  @Mutation(() => CommentResult)
  @UseGuards(JwtAuthGuard)
  async deleteComment(
    @Args('comment_id', { type: () => Int }) comment_id: number,
  ) {
    const result = await this.commentService.remove(comment_id);
    if (result === true) {
      return {
        code: 200,
        message: `Comment deleted successfully with ID ${comment_id}`,
        data: [],
      };
    }
    return {
      code: 204,
      message: `Failed to delete comment with ID ${comment_id}`,
      data: [],
    };
  }
}
