import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { Article } from './entity/article.entity';
import { ArticleController } from './article.controller';
import { TencentCosModule } from '../tencent-cos/tencent-cos.module';

@Module({
  imports: [TypeOrmModule.forFeature([Article]), TencentCosModule],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
