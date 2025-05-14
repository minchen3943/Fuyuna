import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { TencentCosService } from '../tencent-cos/tencent-cos.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { PassThrough } from 'stream';
import { ArticleService } from './article.service';

interface ValidUploadFile {
  buffer: Buffer;
  originalname: string;
}

/**
 * 判断文件是否为有效上传文件
 * @param file 待校验对象
 * @returns 是否有效的文件
 */
function isValidUploadFile(file: unknown): file is ValidUploadFile {
  return (
    !!file &&
    typeof file === 'object' &&
    'buffer' in file &&
    Buffer.isBuffer(file.buffer) &&
    'originalname' in file &&
    typeof file.originalname === 'string'
  );
}

/**
 * 文章控制器
 * @remarks 提供文章相关的上传等接口
 */
@Controller('article')
export class ArticleController {
  /**
   * 构造函数，注入 ArticleService 和 TencentCosService
   * @param articleService 文章服务实例
   * @param tencentCosService 腾讯云 COS 服务实例
   */
  constructor(
    private readonly tencentCosService: TencentCosService,
    private readonly articleService: ArticleService,
  ) {}

  /**
   * 创建文章
   * @param file 上传的文件
   * @returns 上传结果
   */
  @Post('')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createArticle(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { articleTitle: string },
  ) {
    const isMarkdown =
      file &&
      (file.mimetype === 'text/markdown' ||
        file.originalname.toLowerCase().endsWith('.md'));
    if (!isValidUploadFile(file)) {
      return {
        code: 400,
        message: 'Invalid file.',
        data: [],
      };
    }
    if (!isMarkdown) {
      return {
        code: 415,
        message: 'Only Markdown files (.md) are allowed for upload.',
        data: [],
      };
    }
    if (!body.articleTitle) {
      return {
        code: 400,
        message: 'Missing required parameter (articleTitle).',
        data: [],
      };
    }
    const stream = new PassThrough();
    stream.end(file.buffer);
    const data = await this.tencentCosService.putArticle(stream);
    if (!data) {
      return {
        code: 500,
        message: 'Failed to upload file.',
        data: data,
      };
    }
    data.articleTitle = body.articleTitle;
    const result = await this.articleService.create(data);
    return {
      code: 201,
      message: 'Article created successfully.',
      data: [result],
    };
  }
}
