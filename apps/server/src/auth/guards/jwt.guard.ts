import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';
import { Redis } from 'ioredis';
import { REDIS_CLIENT } from 'src/constants';

declare global {
  interface User {
    jti?: string;
    [key: string]: any;
  }
}

/**
 * JWT 认证守卫
 * @remarks 用于保护需要认证的路由，支持自定义是否公开
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(REDIS_CLIENT)
    private readonly redis: Redis,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const can = (await super.canActivate(context)) as boolean;

    if (!can) return false;

    const request = this.getRequest(context);
    const user = request.user as User;

    if (user?.jti) {
      const isBlacklisted = await this.redis.get(`blacklist:${user.jti}`);
      if (isBlacklisted) {
        throw new UnauthorizedException('Token has been revoked');
      }
    }
    return true;
  }

  getRequest(context: ExecutionContext): Request {
    const ctx: { req?: Request } = context.getArgByIndex(2);
    return ctx?.req || context.switchToHttp().getRequest();
  }
}
