import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { jwtConfig } from '@fuyuna/configs';

/**
 * JWT 策略
 * @remarks 用于解析和验证 JWT Token 的 Passport 策略实现
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * 构造函数，配置 JWT 策略参数
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.getValue('JWT_SECRET'),
    });
  }
  validate(payload: Record<string, unknown>) {
    return payload;
  }
}
