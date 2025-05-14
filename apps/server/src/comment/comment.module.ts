import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment as comment } from './entity/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([comment])],
  providers: [CommentService, CommentResolver],
})
export class CommentModule {}
