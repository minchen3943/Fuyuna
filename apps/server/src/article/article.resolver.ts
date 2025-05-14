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
    private readonly tencentCosService: TencentCosService
  ) {}

  @Query(() => ArticleResult)
  /**
   * 查询所有文章
   * @returns 返回包含所有文章的结果对象
   */
  async getAllArticle() {
    const result = await this.articleService.findAll();
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} articles`,
        data: result,
      };
    }
    return { code: 404, message: 'No articles found.', data: [] };
  }

  @Query(() => ArticleResult)
  /**
   * 根据页码和每页数量查询文章
   * @param page 页码
   * @param pageSize 每页数量
   * @returns 返回指定页码的文章结果对象
   */
  async getArticleByPage(
    @Args('page', { type: () => Int }) page: number,
    @Args('pageSize', { type: () => Int }) pageSize: number
  ) {
    const result = await this.articleService.findByPage(page, pageSize);
    if (result && result.length > 0) {
      return {
        code: 200,
        message: `Found ${result.length} articles on page ${page}.`,
        data: result,
      };
    }
    return {
      code: 404,
      message: `No articles found on page ${page}.`,
      data: [],
    };
  }

  @Query(() => TotalPages)
  /**
   * 获取文章的总页数
   * @param pageSize 每页数量
   * @returns 返回总页数的结果对象
   */
  async getArticleTotalPages(
    @Args('pageSize', { type: () => Int }) pageSize: number
  ) {
    if (pageSize <= 0) {
      return {
        code: 400,
        message: 'Page size must be greater than 0.',
        data: [],
      };
    }
    const result = await this.articleService.getTotalPages(pageSize);
    return {
      code: 200,
      message: `Total pages: ${result.totalPages} for page size ${pageSize}.`,
      data: result.totalPages,
    };
  }

  @Query(() => ArticleResult, { nullable: true })
  /**
   * 根据文章ID查询文章
   * @param id 文章ID
   * @returns 返回指定ID的文章结果对象
   */
  async getArticleById(@Args('id', { type: () => Int }) id: number) {
    const result = await this.articleService.findById(id);
    if (result) {
      return {
        code: 200,
        message: `Found article with ID ${id}.`,
        data: [result],
      };
    }
    return {
      code: 404,
      message: `No article found with ID ${id}.`,
      data: [],
    };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  /**
   * 创建新文章
   * @param input 创建文章的输入数据
   * @returns 返回创建成功的文章结果对象
   */
  async createArticle(@Args('input') input: CreateArticleInput) {
    const result = await this.articleService.create(input);
    if (result) {
      return {
        code: 200,
        message: `Article created successfully with ID ${result.articleId}.`,
        data: [result],
      };
    }
    return { code: 500, message: `Failed to create article.`, data: [] };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  /**
   * 更新文章信息
   * @param data 更新文章的输入数据
   * @returns 返回更新成功的文章结果对象
   */
  async updateArticle(@Args('input') data: UpdateArticleInput) {
    if (!data.articleId) {
      return {
        code: 400,
        message: 'Missing required parameter (articleId).',
        data: [],
      };
    }
    if (
      data.articleStatus &&
      (typeof data.articleStatus !== 'number' ||
        !Object.values(ArticleStatus).includes(data.articleStatus))
    ) {
      return {
        code: 400,
        message: 'Invalid article_status value.',
        data: [],
      };
    }
    const result = await this.articleService.update(data);

    if (result) {
      return {
        code: 200,
        message: `Article updated successfully with ID ${result.articleId}.`,
        data: [result],
      };
    }

    return {
      code: 500,
      message: `Failed to update article with ID ${data.articleId}.`,
      data: [],
    };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  /**
   * 更新文章状态
   * @param articleId 文章ID
   * @param articleStatus 文章状态
   * @returns 返回更新成功的文章状态结果对象
   */
  async updateArticleStatus(
    @Args('article_id', { type: () => Int }) articleId: number,
    @Args('article_status', { type: () => Int }) articleStatus: number
  ) {
    if (
      typeof articleStatus !== 'number' ||
      !Object.values(ArticleStatus).includes(articleStatus)
    ) {
      return {
        code: 400,
        message: 'Invalid article_status value.',
        data: [],
      };
    }
    const result = await this.articleService.updateStatus(
      articleId,
      articleStatus
    );

    if (result) {
      return {
        code: 200,
        message: `Article status updated successfully with ID ${articleId}.`,
        data: [result],
      };
    }

    return {
      code: 500,
      message: `Failed to update article status with ID ${articleId}.`,
      data: [],
    };
  }

  @Mutation(() => ArticleResult)
  @UseGuards(JwtAuthGuard)
  /**
   * 删除文章
   * @param articleId 文章ID
   * @returns 返回删除成功的结果对象
   */
  async deleteArticle(
    @Args('article_id', { type: () => Int }) articleId: number
  ) {
    const article = await this.articleService.findById(articleId);
    if (!article) {
      return {
        code: 404,
        message: `No article found with ID ${articleId}.`,
        data: [],
      };
    }
    await this.tencentCosService.delObject({
      Region: article?.articleBucketRegion,
      Bucket: article?.articleBucketName,
      Key: article?.articleBucketKey,
    });
    const result = await this.articleService.delete(articleId);

    if (result === true) {
      return {
        code: 200,
        message: `Article deleted successfully with ID ${articleId}.`,
        data: [],
      };
    }

    return {
      code: 500,
      message: `Failed to delete article with ID ${articleId}.`,
      data: [],
    };
  }
}
