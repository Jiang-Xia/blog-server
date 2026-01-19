import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { AllAppModules } from './modules/registry';
import { TestPermissionController } from './test-permission.controller';
import { PermissionGuard } from './modules/security/auth/permission.guard';

// import { GatewagMiddleware } from './middleware/gateway.middleware';

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
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    ...AllAppModules,
  ],
  controllers: [AppController, TestPermissionController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
// 相关字段解释  https://docs.nestjs.cn/8/modules?id=功能模块
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     // * 对所有路由生效
//     consumer.apply(GatewagMiddleware).forRoutes('*');
//     // consumer.apply(GatewagMiddleware);
//   }
// }
