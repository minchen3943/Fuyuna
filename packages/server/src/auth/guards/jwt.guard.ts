import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../../common/decorators/public.decorator';

/**
 * JWT 认证守卫
 * @remarks 用于保护需要认证的路由，支持自定义是否公开
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * 构造函数，注入 Reflector
   * @param reflector 反射器实例
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 判断当前请求是否可以激活（即是否通过认证）
   * @param context 执行上下文
   * @returns 是否允许通过
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * 处理请求，返回请求对象
   * @param req Express 请求对象
   * @returns 请求对象
   */
  getRequest(context: ExecutionContext): Request {
    const ctx: { req?: Request } = context.getArgByIndex(2);
    return ctx?.req || context.switchToHttp().getRequest();
  }
}
