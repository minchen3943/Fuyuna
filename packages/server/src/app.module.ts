import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { postgresConfig } from "@fuyuna/configs";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => postgresConfig.getTypeOrmConfig(),
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
