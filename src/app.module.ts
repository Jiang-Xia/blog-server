import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
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
import { Config } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
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
