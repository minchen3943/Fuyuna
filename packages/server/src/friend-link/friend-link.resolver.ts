import { Resolver } from '@nestjs/graphql';
import { FriendLinkService } from './friend-link.service';

@Resolver()
export class FriendLinkResolver {
  constructor(private readonly friendLinkService: FriendLinkService) {}
}
