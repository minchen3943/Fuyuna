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

@Controller('article')
export class ArticleController {
  constructor(
    private readonly tencentCosService: TencentCosService,
    private readonly articleService: ArticleService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { articleTitle: string },
  ) {
    if (!isValidUploadFile(file)) {
      return {
        code: 400,
        message: '无效的文件上传',
      };
    }
    const stream = new PassThrough();
    stream.end(file.buffer);
    const data = await this.tencentCosService.putObject(stream);
    if (!data) {
      return {
        code: 204,
        message: 'Filed to upload file',
        data: data,
      };
    }
    data.article_title = body.articleTitle;
    const result = await this.articleService.create(data);
    return {
      code: 200,
      message: '文件上传成功',
      data: [result],
    };
  }
}
