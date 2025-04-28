import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { ArticleResolver } from './article.resolver';
import { Article } from './entity/article.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleResolver, ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
