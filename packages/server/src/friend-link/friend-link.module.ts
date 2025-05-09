import { Module } from '@nestjs/common';
import { FriendLinkService } from './friend-link.service';
import { FriendLinkResolver } from './friend-link.resolver';

@Module({
  providers: [FriendLinkResolver, FriendLinkService],
})
export class FriendLinkModule {}
