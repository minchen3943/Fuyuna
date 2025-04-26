import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { Request, Response } from 'express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver } from '@nestjs/apollo';
import { postgresConfig, graphqlConfig } from '@fuyuna/configs';
import { CommentModule } from './comment/comment.module';
import { AdminModule } from './admin/admin.module';
import { AdminResolver } from './admin/admin.resolver';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...postgresConfig.getTypeOrmConfig(),
      }),
    }),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        ...graphqlConfig.getGraphqlConfig(),
        context: ({ req, res }: { req: Request; res: Response }) => ({
          req,
          res,
        }),
      }),
    }),

    CommentModule,
    AdminModule,
    AuthModule,
  ],

  controllers: [],
  providers: [AdminResolver],
})
export class AppModule {}
