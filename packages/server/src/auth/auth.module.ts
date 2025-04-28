import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from '../admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@fuyuna/configs';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      useFactory: () => ({ ...jwtConfig.getTypeOrmConfig() }),
    }),
    forwardRef(() => AdminModule),
  ],
  exports: [AuthService, JwtAuthGuard, JwtStrategy],
})
export class AuthModule {}
