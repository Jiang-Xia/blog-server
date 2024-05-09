import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
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
import { FileModule } from './modules/file/file.module';

import { Config } from './config';

// 如果 NODE_ENV 未设置，则默认为 development
const environment = process.env.NODE_ENV || 'development';
const envFilePath = `.env.${environment}`;
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // 自动读取本地.env文件
      envFilePath: envFilePath,
    }),
    // 使用 TypeORM 异步配置数据库
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          ...Config.databaseConfig,
          entities: [__dirname + '/**/*.entity{.ts,.js}'], // 路径不要改
        };
      },
    }),
    ScheduleModule.forRoot(),
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
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// 相关字段解释  https://docs.nestjs.cn/8/modules?id=功能模块
export class AppModule {}
