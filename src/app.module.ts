import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArticleModule } from './modules/article/article.module';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { TagModule } from './modules/tag/tag.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { ReplyModule } from './modules/reply/reply.module';
import { LikeModule } from './modules/like/like.module';
import { MsgboardModule } from './modules/msgboard/msgboard.module';
import { AdminModule } from './modules/admin/admin.module';

import { ResourcesModule } from './modules/resources/resources.module';
import { databaseConfig } from './config';
@Module({
  imports: [
    // 使用 TypeORM 配置数据库
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // 路径不要改
      synchronize: true,
    }),
    ArticleModule,
    UserModule,
    CategoryModule,
    TagModule,
    AuthModule,
    CommentModule,
    ReplyModule,
    LikeModule,
    ResourcesModule,
    MsgboardModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
