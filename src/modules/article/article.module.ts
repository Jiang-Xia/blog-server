import { Module } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleController } from './article.controller';
import { Article } from './entity/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CategoryModule } from '../category/category.module';
import { TagModule } from '../tag/tag.module';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/comment.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    CategoryModule,
    TagModule,
    LikeModule,
    CommentModule,
    AuthModule,
    UserModule,
  ],
  exports: [ArticleService],
  providers: [ArticleService],
  controllers: [ArticleController],
})
export class ArticleModule {}
