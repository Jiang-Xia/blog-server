/*
 * @Author: 酱
 * @LastEditors: 酱
 * @Date: 2021-11-12 17:31:46
 * @LastEditTime: 2022-01-20 16:17:05
 * @Description:
 * @FilePath: \blog-server\src\main.ts
 */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 全局Http拦截器
import { TransformInterceptor } from './interceptor/transform.interceptor';
// 全局Http异常过滤器
import { HttpExceptionFilter } from './filters/http-execption.filter';
// 全局表单类验证器
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { serveConfig } from './config';

async function bootstrap() {
  console.log(serveConfig.isDev ? '==生产环境==' : '==开发环境==');
  const app = await NestFactory.create(AppModule, {
    logger: serveConfig.isDev
      ? ['log', 'debug', 'error', 'warn']
      : ['error', 'warn'],
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // 允许跨域
  app.enableCors();
  // 配置swagger
  const options = new DocumentBuilder()
    .setTitle('blog-serve')
    .setDescription('接口文档')
    .setVersion('1.0')
    // 添加鉴权
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(serveConfig.apiPath, app, document);
  await app.listen(5000);
  Logger.log(
    `服务已经启动,接口请访问:http://${serveConfig.ip}:${serveConfig.prot}`,
  );
  Logger.log(
    `服务已经启动,文档请访问:http://${serveConfig.ip}:${serveConfig.prot}/${serveConfig.apiPath}`,
  );
}
bootstrap();
