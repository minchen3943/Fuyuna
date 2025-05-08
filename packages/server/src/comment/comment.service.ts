/**
 * @file 评论服务文件
 * @description 实现评论相关的业务逻辑
 * @module CommentService
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entity/comment.entity';
import { Repository } from 'typeorm';
import { CreateCommentInput, UpdateCommentInput } from './input/comment.input';

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
  ) {}

  /**
   * @method findAll
   * @description 查询所有评论
   * @returns {Promise<Comment[]|null>} 评论数组或null
   */
  async findAll(): Promise<Comment[] | null> {
    const comments = await this.commentRepo.find();
    if (comments.length > 0) {
      this.logger.log(`Found ${comments.length} comments`);
      return comments;
    } else {
      this.logger.warn('No comments found');
      return null;
    }
  }

  /**
   * @method findById
   * @description 根据ID查询单个评论
   * @param {number} commentId - 评论ID
   * @returns {Promise<Comment|null>} 评论对象或null
   */
  async findById(commentId: number): Promise<Comment | null> {
    const comment = await this.commentRepo.findOneBy({ commentId: commentId });
    if (comment) {
      this.logger.log(`Found comment with ID ${commentId}`);
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
    const comments = await this.commentRepo.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { created_at: 'DESC' },
    });
    if (comments.length > 0) {
      this.logger.log(`Found ${comments.length} comments on page ${page}`);
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
    const totalComments = await this.commentRepo.count();
    const totalPages = Math.ceil(totalComments / pageSize);
    this.logger.log(`Total pages: ${totalPages} for page size ${pageSize}`);
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
      return Promise.resolve(true);
    } else {
      this.logger.warn(`Failed to delete comment with ID ${commentId}`);
      return Promise.resolve(false);
    }
  }
}
