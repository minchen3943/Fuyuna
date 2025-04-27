import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { CreateCommentInput, UpdateCommentInput } from './input/comment.input';
import { TotalPages } from './output/comment.output';
import { CommentResult } from './entity/commentResult.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CommentStatus } from './entity/comment.entity';
@Resolver(() => CommentResult)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

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
        data: [result],
      };
    }
    return {
      code: 204,
      message: `No comments found on page ${page}`,
      data: [],
    };
  }

  @Query(() => TotalPages)
  async getCommentTotalPages(
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    if (pageSize <= 0) {
      return {
        code: 400,
        message: 'Page size must be greater than 0',
        data: null,
      };
    }
    const result = await this.commentService.getTotalPages(pageSize);
    return {
      code: 200,
      message: `Total pages: ${result.totalPages} for page size ${pageSize}`,
      data: result.totalPages,
    };
  }

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
    return { code: 204, message: `No comment found with ID ${id}`, data: null };
  }

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
    return { code: 204, message: 'Failed to create comment', data: null };
  }

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
      data: null,
    };
  }

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
    return {
      code: 200,
      message: `Comment status updated successfully with ID ${comment_id}`,
      data: [result],
    };
  }

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
