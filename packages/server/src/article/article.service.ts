/**
 * @file 文章服务文件
 * @description 实现文章相关的业务逻辑
 * @module ArticleService
 */

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entity/article.entity';
import { CreateArticleInput, UpdateArticleInput } from './input/article.input';

/**
 * @class ArticleService
 * @description 文章服务类，处理文章相关的业务逻辑
 * @property {Repository<Article>} articleRepo - 文章仓库实例
 */
@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  /**
   * 构造函数，注入 Article 仓库
   * @param articleRepository 文章实体仓库
   */
  constructor(
    @InjectRepository(Article)
    private readonly articleRepo: Repository<Article>,
  ) {}

  /**
   * @method findAll
   * @description 查询所有文章
   * @returns {Promise<Article[]|null>} 文章数组或null
   */
  async findAll(): Promise<Article[] | null> {
    const articles = await this.articleRepo.find({
      where: { article_status: 1 },
      order: { created_at: 'DESC' },
    });
    if (articles.length > 0) {
      this.logger.log(`Found ${articles.length} articles`);
      this.logger.debug(`Articles: ${JSON.stringify(articles)}`);
      return articles;
    } else {
      this.logger.warn('No articles found');
      return null;
    }
  }

  /**
   * @method findById
   * @description 根据ID查询单个文章
   * @param {number} articleId - 文章ID
   * @returns {Promise<Article|null>} 文章对象或null
   */
  async findById(articleId: number): Promise<Article | null> {
    const article = await this.articleRepo.findOneBy({ article_id: articleId });
    if (article) {
      this.logger.log(`Found article with ID ${articleId}`);
      this.logger.debug(`Article: ${JSON.stringify(article)}`);
      return article;
    } else {
      this.logger.warn(`No article found with ID ${articleId}`);
      return null;
    }
  }

  /**
   * @method findByPage
   * @description 分页查询文章
   * @param {number} page - 页码
   * @param {number} pageSize - 每页数量
   * @returns {Promise<Article[]|null>} 文章数组或null
   */
  async findByPage(page: number, pageSize: number): Promise<Article[] | null> {
    const articles = await this.articleRepo.find({
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: { article_status: 1 },
      order: { created_at: 'DESC' },
    });
    if (articles.length > 0) {
      this.logger.log(`Found ${articles.length} articles on page ${page}`);
      this.logger.debug(`Articles: ${JSON.stringify(articles)}`);
      return articles;
    } else {
      this.logger.warn(`No articles found on page ${page}`);
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
    const totalArticles = await this.articleRepo.count();
    const totalPages = Math.ceil(totalArticles / pageSize);
    this.logger.log(`Total pages: ${totalPages} for page size ${pageSize}`);
    this.logger.debug(`Total articles: ${totalArticles}`);
    return { totalPages };
  }

  /**
   * @method create
   * @description 创建新文章
   * @param {CreateArticleInput} data - 创建文章的输入参数
   * @returns {Promise<Article|null>} 新创建的文章或null
   */
  async create(data: CreateArticleInput): Promise<Article | null> {
    const article = this.articleRepo.create(data);
    const result = await this.articleRepo.save(article);
    if (result) {
      this.logger.log(
        `Article created successfully with ID ${result.article_id}`,
      );
      this.logger.debug(`Article: ${JSON.stringify(result)}`);
      return result;
    } else {
      this.logger.warn('Failed to create article');
      return null;
    }
  }

  /**
   * @method update
   * @description 更新文章
   * @param {UpdateArticleInput} data - 更新文章的输入参数
   * @returns {Promise<Article|null>} 更新后的文章或null
   */
  async update(data: UpdateArticleInput): Promise<Article | null> {
    if (!(await this.findById(data.articleId))) {
      return null;
    }
    const result = await this.articleRepo.save({ ...data });
    if (result) {
      this.logger.log(`Article updated successfully with ID ${data.articleId}`);
      this.logger.debug(`Updated article: ${JSON.stringify(result)}`);
      return await this.articleRepo.findOneBy({ article_id: data.articleId });
    } else {
      this.logger.warn(`Failed to update article with ID ${data.articleId}`);
      return null;
    }
  }

  /**
   * @method updateStatus
   * @description 更新文章状态
   * @param {number} articleId - 文章ID
   * @param {number} articleStatus - 新状态值
   * @returns {Promise<Article|null>} 更新状态后的文章或null
   */
  async updateStatus(
    articleId: number,
    articleStatus: number,
  ): Promise<Article | null> {
    if (!(await this.findById(articleId))) {
      return null;
    }
    const result = await this.articleRepo.save({
      ...{ article_id: articleId, article_status: articleStatus },
    });
    if (result) {
      this.logger.log(
        `Article status updated successfully for ID ${articleId}`,
      );
      this.logger.debug(`Updated article status: ${articleStatus}`);
      return this.articleRepo.findOneBy({ article_id: articleId });
    } else {
      this.logger.warn(`Failed to update article status for ID ${articleId}`);
      return null;
    }
  }

  /**
   * @method remove
   * @description 删除文章
   * @param {number} articleId - 文章ID
   * @returns {Promise<boolean>} 是否删除成功
   */
  async remove(articleId: number): Promise<boolean> {
    const result = await this.articleRepo.delete(articleId);
    if (result.affected === 1) {
      this.logger.log(`Article deleted successfully with ID ${articleId}`);
      this.logger.debug(`Deleted article ID: ${articleId}`);
      return Promise.resolve(true);
    } else {
      this.logger.warn(`Failed to delete article with ID ${articleId}`);
      return Promise.resolve(false);
    }
  }
}
