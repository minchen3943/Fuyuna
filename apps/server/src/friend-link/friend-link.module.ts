import { Module } from '@nestjs/common';
import { FriendLinkService } from './friend-link.service';
import { FriendLinkResolver } from './friend-link.resolver';
import { FriendLinkController } from './friend-link.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FriendLink } from './entity/friendLink.entity';
import { TencentCosModule } from '../tencent-cos/tencent-cos.module';

@Module({
  imports: [TypeOrmModule.forFeature([FriendLink]), TencentCosModule],
  controllers: [FriendLinkController],
  providers: [FriendLinkResolver, FriendLinkService],
})
export class FriendLinkModule {}
