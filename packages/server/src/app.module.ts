import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GraphQLModule } from "@nestjs/graphql";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { postgresConfig, graphqlConfig } from "@fuyuna/configs";
import { CommentModule } from "./comment/comment.module";

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
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      //eslint-disable-next-line
      useFactory: (): Partial<ApolloDriverConfig> => ({
        ...graphqlConfig.getGraphqlConfig(),
      }),
    }),
    CommentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
