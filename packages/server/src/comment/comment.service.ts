/**
 * @file 评论服务文件
 * @description 实现评论相关的业务逻辑
 * @module CommentService
 */

import { Injectable, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentInput, UpdateCommentInput } from './input/comment.input';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/constants';

/**
 * @class CommentService
 * @description 评论服务类，处理评论相关的业务逻辑
 * @property {Repository<Comment>} commentRepo - 评论仓库实例
 */
@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {}

  /**
   * 查询所有评论（优先缓存）
   * @returns {Promise<Comment[] | null>} 评论数组或 null
   */
  async findAll(): Promise<Comment[] | null> {
    const key = 'comment:all';
    const cached = await this.redis.get(key);
    if (cached) {
      const comments = JSON.parse(cached) as Comment[];
      comments.forEach((comment) => {
        comment.created_at = new Date(comment.created_at);
        comment.updated_at = new Date(comment.updated_at);
      });
      this.logger.log(`(cache) Found ${comments.length} comments`);
      this.logger.debug(`(cache) Comments: ${JSON.stringify(comments)}`);
      return comments;
    }
    const comments = await this.commentRepo.find();
    if (comments.length > 0) {
      this.logger.log(`Found ${comments.length} comments`);
      this.logger.debug(`Comments: ${JSON.stringify(comments)}`);
      await this.redis.set(key, JSON.stringify(comments), 'EX', 18000);
      return comments;
    } else {
      this.logger.warn('No comments found');
      return null;
    }
  }

  /**
   * 根据ID查询单个评论（优先缓存）
   * @param {number} commentId 评论ID
   * @returns {Promise<Comment | null>} 评论对象或 null
   */
  async findById(commentId: number): Promise<Comment | null> {
    const key = `comment:id:${commentId}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const comment = JSON.parse(cached) as Comment;
      comment.created_at = new Date(comment.created_at);
      comment.updated_at = new Date(comment.updated_at);
      this.logger.log(`(cache) Found comment with ID ${commentId}`);
      this.logger.debug(`(cache) Comment: ${JSON.stringify(comment)}`);
      return comment;
    }
    const comment = await this.commentRepo.findOneBy({ commentId: commentId });
    if (comment) {
      this.logger.log(`Found comment with ID ${commentId}`);
      this.logger.debug(`Comment: ${JSON.stringify(comment)}`);
      await this.redis.set(key, JSON.stringify(comment), 'EX', 18000);
      return comment;
    } else {
      this.logger.warn(`No comment found with ID ${commentId}`);
      return null;
    }
  }

  /**
   * @method findByPage
   * @description 分页查询评论
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @returns {Promise<Comment[]|null>} 评论数组或null
   */
  async findByPage(page: number, pageSize: number): Promise<Comment[] | null> {
    const key = `comment:page:${page}:${pageSize}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const comments = JSON.parse(cached) as Comment[];
      comments.forEach((comment) => {
        comment.created_at = new Date(comment.created_at);
        comment.updated_at = new Date(comment.updated_at);
      });
      this.logger.log(
        `(cache) Found ${comments.length} comments on page ${page}`,
      );
      this.logger.debug(`(cache) Comments: ${JSON.stringify(comments)}`);
      return comments;
    }
    const comments = await this.commentRepo.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { created_at: 'DESC' },
    });
    if (comments.length > 0) {
      await this.redis.set(key, JSON.stringify(comments), 'EX', 18000);
      this.logger.log(`Found ${comments.length} comments on page ${page}`);
      this.logger.debug(`Comments: ${JSON.stringify(comments)}`);
      return comments;
    } else {
      this.logger.warn(`No comments found on page ${page}`);
      return null;
    }
  }

  /**
   * @method getTotalPages
   * @description 计算总页数
   * @param {number} pageSize - 每页数量
   * @returns {Promise<{totalPages: number}>} 包含总页数的对象
   */
  async getTotalPages(pageSize: number): Promise<{ totalPages: number }> {
    const key = `comment:totalPage:${pageSize}`;
    const cached = await this.redis.get(key);
    if (cached) {
      const totalComments = JSON.parse(cached) as number;
      const totalPages = Math.ceil(totalComments / pageSize);
      this.logger.log(
        `(cache) Total pages: ${totalPages} for page size ${pageSize}`,
      );
      this.logger.debug(`Total comments: ${totalComments}`);
      return { totalPages };
    }
    const totalComments = await this.commentRepo.count();
    await this.redis.set(key, JSON.stringify(totalComments), 'EX', 18000);
    const totalPages = Math.ceil(totalComments / pageSize);
    this.logger.log(`Total pages: ${totalPages} for page size ${pageSize}`);
    this.logger.debug(`Total comments: ${totalComments}`);
    return { totalPages };
  }

  /**
   * @method create
   * @description 创建新评论
   * @param {CreateCommentInput} data - 创建评论的输入参数
   * @returns {Promise<Comment|null>} 新创建的评论或null
   */
  async create(data: CreateCommentInput): Promise<Comment | null> {
    const comment = this.commentRepo.create(data);
    const result = await this.commentRepo.save(comment);
    if (result) {
      this.logger.log(
        `Comment created successfully with ID ${result.commentId}`,
      );
      this.logger.debug(`Comment: ${JSON.stringify(result)}`);
      return result;
    } else {
      this.logger.warn('Failed to create comment');
      return null;
    }
  }

  /**
   * @method update
   * @description 更新评论
   * @param {UpdateCommentInput} data - 更新评论的输入参数
   * @returns {Promise<Comment|null>} 更新后的评论或null
   */
  async update(data: UpdateCommentInput): Promise<Comment | null> {
    if (!(await this.findById(data.commentId))) {
      return null;
    }
    const result = await this.commentRepo.save({ ...data });
    if (result) {
      this.logger.log(`Comment updated successfully with ID ${data.commentId}`);
      this.logger.debug(`Updated comment: ${JSON.stringify(result)}`);
      return this.commentRepo.findOneBy({ commentId: data.commentId });
    } else {
      this.logger.warn(`Failed to update comment with ID ${data.commentId}`);
      return null;
    }
  }

  /**
   * @method updateStatus
   * @description 更新评论状态
   * @param {number} commentId - 评论ID
   * @param {number} commentStatus - 新状态值
   * @returns {Promise<Comment|null>} 更新状态后的评论或null
   */
  async updateStatus(
    commentId: number,
    commentStatus: number,
  ): Promise<Comment | null> {
    if (!(await this.findById(commentId))) {
      return null;
    }
    const result = await this.commentRepo.save({ commentId, commentStatus });
    if (result) {
      this.logger.log(
        `Comment status updated successfully for ID ${commentId}`,
      );
      this.logger.debug(`Updated comment status: ${JSON.stringify(result)}`);
      return this.commentRepo.findOneBy({ commentId: commentId });
    } else {
      this.logger.warn(`Failed to update comment status for ID ${commentId}`);
      return null;
    }
  }

  /**
   * @method remove
   * @description 删除评论
   * @param {number} commentId - 评论ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  async remove(commentId: number): Promise<boolean> {
    const result = await this.commentRepo.delete(commentId);
    if (result.affected === 1) {
      this.logger.log(`Comment deleted successfully with ID ${commentId}`);
      this.logger.debug(`Deleted comment ID: ${commentId}`);
      return Promise.resolve(true);
    } else {
      this.logger.warn(`Failed to delete comment with ID ${commentId}`);
      return Promise.resolve(false);
    }
  }
}
