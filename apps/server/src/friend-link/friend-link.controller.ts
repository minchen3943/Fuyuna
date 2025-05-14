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
import { CreateFriendLinkInput } from './input/friendLink.input';

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
   * 创建友链
   * @param file 上传的文件
   * @param body 友链信息
   * @param body.linkTitle 友链标题
   * @param body.linkURL 友链 URL
   * @param body.linkDescription 友链描述
   * @returns 上传结果
   */
  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createFriendLink(
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: { linkTitle: string; linkURL: string; linkDescription?: string },
  ) {
    if (!body.linkTitle || !body.linkURL) {
      return {
        code: 400,
        message: 'Missing required parameters (linkTitle, linkURL).',
        data: [],
      };
    }
    if (!file) {
      const friendLink: CreateFriendLinkInput = {
        linkTitle: body.linkTitle,
        linkUrl: body.linkURL,
        linkStatus: 0,
      };
      const result = await this.friendLinkService.createFriendLink(friendLink);
      return {
        code: 201,
        message: 'Friend link created successfully.',
        data: [result],
      };
    }
    if (!isValidUploadFile(file)) {
      return {
        code: 400,
        message: 'Invalid file.',
        data: [],
      };
    }
    const stream = new PassThrough();
    stream.end(file.buffer);
    const data = await this.tencentCosService.putFriendLinkLogo(stream);
    if (!data) {
      return {
        code: 500,
        message: 'Failed to create friend link.',
        data: data,
      };
    }
    const friendLink: CreateFriendLinkInput = {
      linkTitle: body.linkTitle,
      linkUrl: body.linkURL,
      linkImageBucketName: data.linkImageBucketName,
      linkImageBucketRegion: data.linkImageBucketRegion,
      linkImageBucketKey: data.linkImageBucketKey,
      linkStatus: 0,
    };
    if (body.linkDescription) {
      friendLink.linkDescription = body.linkDescription;
    }
    const result = await this.friendLinkService.createFriendLink(friendLink);
    return {
      code: 201,
      message: 'Friend link created successfully.',
      data: [result],
    };
  }
}
