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
import { FriendLinkService } from './friend-link.service';

interface ValidUploadFile {
  buffer: Buffer;
  originalname: string;
}

/**
 * 判断文件是否为有效上传文件
 * @param file 待校验对象
 * @returns 是否为 ValidUploadFile 类型
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
 * 友链控制器
 * @remarks 提供友链相关的上传等接口
 */
@Controller('friend-link')
export class FriendLinkController {
  /**
   * 构造函数，注入 FriendLinkService 和 TencentCosService
   * @param friendLinkService 友链服务实例
   * @param tencentCosService 腾讯云 COS 服务实例
   */
  constructor(
    private readonly tencentCosService: TencentCosService,
    private readonly friendLinkService: FriendLinkService,
  ) {}

  /**
   * 上传友链图标到 COS
   * @param file 上传的文件
   * @returns 上传结果
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { linkName: string },
  ) {
    if (!isValidUploadFile(file)) {
      return {
        code: 400,
        message: '无效的文件',
        data: null,
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
    // 创建友链对象并保存
    const friendLink = {
      link_name: body.linkName,
      link_logo: data.article_key, // 使用上传的文件路径作为logo
    };
    const result = await this.friendLinkService.createFriendLink(friendLink);
    return {
      code: 200,
      message: '文件上传成功',
      data: [result],
    };
  }
}