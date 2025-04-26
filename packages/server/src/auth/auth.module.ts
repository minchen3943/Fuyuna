import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminModule } from '../admin/admin.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@fuyuna/configs';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({ ...jwtConfig.getTypeOrmConfig() }),
    }),

    AdminModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
