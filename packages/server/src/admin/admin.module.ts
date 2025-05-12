import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entity/admin.entity';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '@fuyuna/configs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    PassportModule,
    JwtModule.registerAsync({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      useFactory: () => ({ ...jwtConfig.getTypeOrmConfig() }),
    }),
  ],
  providers: [AdminService, AdminResolver],
  exports: [AdminService, JwtModule],
})
export class AdminModule {}
