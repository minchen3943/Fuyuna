import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { Logger } from "@nestjs/common";
import { Comment } from "./entity/comment.entity";
import { CommentService } from "./comment.service";
import { CreateCommentInput, UpdateCommentInput } from "./input/comment.input";
import { TotalPages } from "./output/comment.output";

@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}
  private readonly logger = new Logger(CommentResolver.name);

  @Query(() => [Comment])
  async findAll() {
    return this.commentService.findAll();
  }

  @Query(() => [Comment])
  findByPage(
    @Args("page", { type: () => Int }) page: number,
    @Args("pageSize", { type: () => Int }) pageSize: number,
  ) {
    return this.commentService.findByPage(page, pageSize);
  }

  @Query(() => TotalPages)
  getTotalPages(@Args("pageSize", { type: () => Int }) pageSize: number) {
    if (pageSize <= 0) {
      throw new Error("Page size must be greater than 0");
    }
    return this.commentService.getTotalPages(pageSize);
  }

  @Query(() => Comment, { nullable: true })
  async findById(@Args("id", { type: () => Int }) id: number) {
    return this.commentService.findById(id);
  }

  @Mutation(() => Comment)
  async create(@Args("input") input: CreateCommentInput) {
    return this.commentService.create(input);
  }

  @Mutation(() => Comment)
  async update(@Args("input") data: UpdateCommentInput) {
    return this.commentService.update(data);
  }

  @Mutation(() => Comment)
  async updateStatus(
    @Args("comment_id", { type: () => Int }) comment_id: number,
    @Args("comment_status", { type: () => Int }) comment_status: number,
  ) {
    return this.commentService.updateStatus(comment_id, comment_status);
  }

  @Mutation(() => Boolean)
  async delete(@Args("comment_id", { type: () => Int }) comment_id: number) {
    return await this.commentService.remove(comment_id);
  }
}
