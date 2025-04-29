import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ArticleService } from './article.service';
import { CreateArticleInput, UpdateArticleInput } from './input/article.input';
import { TotalPages } from './output/article.output';
import { ArticleResult } from './entity/articleResult.entity';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ArticleStatus } from './entity/article.entity';
import { TencentCosService } from 'src/tencent-cos/tencent-cos.service';

@Resolver(() => ArticleResult)
export class ArticleResolver {
  constructor(
    private readonly articleService: ArticleService,
    private readonly tencentCosService: TencentCosService,
  ) {}

  @Query(() => ArticleResult)
  async findAllArticle() {
    const result = await this.articleService.findAll();
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} articles`,
        data: result,
      };
    }
    return { code: 204, message: 'No articles found', data: [] };
  }

  @Query(() => ArticleResult)
  async findArticleByPage(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    const result = await this.articleService.findByPage(page, pageSize);
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} articles on page ${page}`,
        data: result,
      };
    }
    return {
      code: 204,
      message: `No articles found on page ${page}`,
      data: [],
    };
  }

  @Query(() => TotalPages)
  async getArticleTotalPages(
    @Args('pageSize', { type: () => Int }) pageSize: number,
  ) {
    if (pageSize <= 0) {
      return {
        code: 400,
        message: 'Page size must be greater than 0',
        data: null,
      };
    }
    const result = await this.articleService.getTotalPages(pageSize);
    return {
      code: 200,
      message: `Total pages: ${result.totalPages} for page size ${pageSize}`,
      data: result.totalPages,
    };
  }

  @Query(() => ArticleResult, { nullable: true })
  async findArticleById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.articleService.findById(id);
    if (result) {
      return {
        code: 200,
        message: `Found article with ID ${id}`,
        data: [result],
      };
    }
    return { code: 204, message: `No article found with ID ${id}`, data: null };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  async createArticle(@Args('input') input: CreateArticleInput) {
    const result = await this.articleService.create(input);
    if (result) {
      return {
        code: 200,
        message: `Article created successfully with ID ${result.article_id}`,
        data: [result],
      };
    }
    return { code: 204, message: 'Failed to create article', data: null };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  async updateArticle(@Args('input') data: UpdateArticleInput) {
    if (
      data.article_status &&
      (typeof data.article_status !== 'number' ||
        !Object.values(ArticleStatus).includes(data.article_status))
    ) {
      return {
        code: 400,
        message: 'Invalid article_status value',
        data: null,
      };
    }
    const result = await this.articleService.update(data);
    if (result) {
      return {
        code: 200,
        message: `Article updated successfully with ID ${result.article_id}`,
        data: [result],
      };
    }
    return {
      code: 204,
      message: `Failed to update article with ID ${data.article_id}`,
      data: null,
    };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  async updateArticleStatus(
    @Args('article_id', { type: () => Int }) article_id: number,
    @Args('article_status', { type: () => Int }) article_status: number,
  ) {
    if (
      typeof article_status !== 'number' ||
      !Object.values(ArticleStatus).includes(article_status)
    ) {
      return {
        code: 400,
        message: 'Invalid article_status value',
        data: null,
      };
    }
    const result = await this.articleService.updateStatus(
      article_id,
      article_status,
    );
    return {
      code: 200,
      message: `Article status updated successfully with ID ${article_id}`,
      data: [result],
    };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Args('article_id', { type: () => Int }) article_id: number,
  ) {
    const article = await this.articleService.findById(article_id);
    if (!article) {
      return {
        code: 204,
        message: `No article found with ID ${article_id}`,
        data: null,
      };
    }
    await this.tencentCosService.delObject({
      Region: article?.article_bucket_region,
      Bucket: article?.article_bucket_name,
      Key: article?.article_key,
    });
    const result = await this.articleService.remove(article_id);
    if (result === true) {
      return {
        code: 200,
        message: `Article deleted successfully with ID ${article_id}`,
        data: null,
      };
    }
    return {
      code: 204,
      message: `Failed to delete article with ID ${article_id}`,
      data: null,
    };
  }
}
