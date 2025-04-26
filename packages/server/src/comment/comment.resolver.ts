/**
 * @file 评论解析器文件
 * @description 定义GraphQL查询和变更操作
 * @module CommentResolver
 */

import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput, UpdateCommentInput } from './input/comment.input';
import { TotalPages } from './output/comment.output';
import { CommentResult } from './entity/commentResult.entity';

/**
 * @class CommentResolver
 * @description GraphQL解析器，处理评论相关的查询和变更
 * @property {CommentService} commentService - 评论服务实例
 */
@Resolver(() => CommentResult)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  /**
   * @method findAll
   * @description 查询所有评论
   * @returns {Promise<CommentResult>} 评论结果对象
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
   * @method findByPage
   * @description 分页查询评论
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @returns {Promise<CommentResult>} 评论结果对象
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
   * @method getTotalPages
   * @description 获取总页数
   * @param {number} pageSize - 每页数量
   * @returns {Promise<TotalPages>} 包含总页数的对象
   */
  @Query(() => TotalPages)
  getCommentTotalPages(
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    if (pageSize <= 0) {
      return {
        code: 400,
        message: 'Page size must be greater than 0',
        data: null,
      };
    }
    return this.commentService.getTotalPages(pageSize);
  }

  /**
   * @method findById
   * @description 根据ID查询单个评论
   * @param {number} id - 评论ID
   * @returns {Promise<CommentResult>} 评论结果对象
   */
  @Query(() => CommentResult, { nullable: true })
  async findCommentById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.commentService.findById(id);
    if (result) {
      return {
        code: 200,
        message: `Found comment with ID ${id}`,
        data: result,
      };
    }
    return { code: 204, message: `No comment found with ID ${id}`, data: null };
  }

  /**
   * @method create
   * @description 创建新评论
   * @param {CreateCommentInput} input - 创建评论的输入参数
   * @returns {Promise<CommentResult>} 评论结果对象
   */
  @Mutation(() => CommentResult)
  async createComment(@Args('input') input: CreateCommentInput) {
    const result = await this.commentService.create(input);
    if (result) {
      return {
        code: 200,
        message: `Comment created successfully with ID ${result.commentId}`,
        data: result,
      };
    }
    return { code: 204, message: 'Failed to create comment', data: null };
  }

  /**
   * @method update
   * @description 更新评论
   * @param {UpdateCommentInput} data - 更新评论的输入参数
   * @returns {Promise<CommentResult>} 评论结果对象
   */
  @Mutation(() => CommentResult)
  async updateComment(@Args('input') data: UpdateCommentInput) {
    const result = await this.commentService.update(data);
    if (result) {
      return {
        code: 200,
        message: `Comment updated successfully with ID ${result.commentId}`,
        data: result,
      };
    }
    return {
      code: 204,
      message: `Failed to update comment with ID ${data.commentId}`,
      data: null,
    };
  }

  /**
   * @method updateStatus
   * @description 更新评论状态
   * @param {number} comment_id - 评论ID
   * @param {number} comment_status - 新状态值
   * @returns {Promise<CommentResult>} 评论结果对象
   */
  @Mutation(() => CommentResult)
  async updateCommentStatus(
    @Args('comment_id', { type: () => Int }) comment_id: number,
    @Args('comment_status', { type: () => Int }) comment_status: number,
  ) {
    const result = await this.commentService.updateStatus(
      comment_id,
      comment_status,
    );
    return {
      code: 200,
      message: `Comment status updated successfully with ID ${comment_id}`,
      data: result,
    };
  }

  /**
   * @method delete
   * @description 删除评论
   * @param {number} comment_id - 评论ID
   * @returns {Promise<CommentResult>} 评论结果对象
   */
  @Mutation(() => CommentResult)
  async deleteComment(
    @Args('comment_id', { type: () => Int }) comment_id: number,
  ) {
    const result = await this.commentService.remove(comment_id);
    if (result === true) {
      return {
        code: 200,
        message: `Comment deleted successfully with ID ${comment_id}`,
        data: null,
      };
    }
    return {
      code: 204,
      message: `Failed to delete comment with ID ${comment_id}`,
      data: null,
    };
  }
}
