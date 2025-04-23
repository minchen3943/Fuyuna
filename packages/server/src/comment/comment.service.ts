import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Comment } from "./entity/comment.entity";
import { Repository } from "typeorm";
import { CreateCommentInput, UpdateCommentInput } from "./input/comment.input";

@Injectable()
export class CommentService {
  private readonly logger = new Logger(CommentService.name);
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[] | null> {
    const comments = await this.commentRepo.find();
    if (comments.length > 0) {
      this.logger.log(`Found ${comments.length} comments`);
      return comments;
    } else {
      this.logger.warn("No comments found");
      return null;
    }
  }

  async findById(comment_id: number): Promise<Comment | null> {
    const comment = await this.commentRepo.findOneBy({ comment_id });
    if (comment) {
      this.logger.log(`Found comment with ID ${comment_id}`);
      return comment;
    } else {
      this.logger.warn(`No comment found with ID ${comment_id}`);
      return null;
    }
  }

  async findByPage(page: number, pageSize: number): Promise<Comment[] | null> {
    const comments = await this.commentRepo.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { created_at: "DESC" },
    });
    if (comments.length > 0) {
      this.logger.log(`Found ${comments.length} comments on page ${page}`);
      return comments;
    } else {
      this.logger.warn(`No comments found on page ${page}`);
      return null;
    }
  }

  async getTotalPages(pageSize: number): Promise<{ totalPages: number }> {
    const totalComments = await this.commentRepo.count();
    const totalPages = Math.ceil(totalComments / pageSize);
    this.logger.log(`Total pages: ${totalPages} for page size ${pageSize}`);
    return { totalPages };
  }

  async create(data: CreateCommentInput): Promise<Comment | null> {
    const comment = this.commentRepo.create(data);
    const result = await this.commentRepo.save(comment);
    if (result) {
      this.logger.log(
        `Comment created successfully with ID ${result.comment_id}`,
      );
      return result;
    } else {
      this.logger.warn("Failed to create comment");
      return null;
    }
  }

  async update(data: UpdateCommentInput): Promise<Comment | null> {
    const result = await this.commentRepo.save({ ...data });
    if (result) {
      this.logger.log(
        `Comment updated successfully with ID ${data.comment_id}`,
      );
      return this.commentRepo.findOneBy({ comment_id: data.comment_id });
    } else {
      this.logger.warn(`Failed to update comment with ID ${data.comment_id}`);
      return null;
    }
  }

  async updateStatus(
    comment_id: number,
    comment_status: number,
  ): Promise<Comment | null> {
    const result = await this.commentRepo.save({ comment_id, comment_status });
    if (result) {
      this.logger.log(
        `Comment status updated successfully for ID ${comment_id}`,
      );
      return this.commentRepo.findOneBy({ comment_id });
    } else {
      this.logger.warn(`Failed to update comment status for ID ${comment_id}`);
      return null;
    }
  }

  async remove(comment_id: number): Promise<boolean> {
    const result = await this.commentRepo.delete(comment_id);
    if (result.affected === 1) {
      this.logger.log(`Comment deleted successfully with ID ${comment_id}`);
      return Promise.resolve(true);
    } else {
      this.logger.warn(`Failed to delete comment with ID ${comment_id}`);
      return Promise.resolve(false);
    }
  }
}
