/*
 * @Author: 酱
 * @LastEditors: 酱
 * @Date: 2021-11-12 17:31:46
 * @LastEditTime: 2022-08-07 18:57:16
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
import { json, text } from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  console.log(serveConfig.isDev ? '==生产环境==' : '==开发环境==');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: serveConfig.isDev ? ['log', 'debug', 'error', 'warn'] : ['error', 'warn'],
  });
  // 配置静态资源目录
  app.useStaticAssets('public');
  // 3.1 设置虚拟路径
  app.useStaticAssets('public', {
    prefix: '/static/',
  });
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  // app.use(json({ limit: '5mb' })); // 统一配置http传输设置 解析json
  app.use(text({ limit: '5mb', type: 'text/xml' })); // json和xml都可以解析

  // 允许跨域
  app.enableCors();
  // 设置api前缀
  app.setGlobalPrefix(serveConfig.apiPath);

  // 配置swagger
  const options = new DocumentBuilder()
    .setTitle('blog-serve')
    .setDescription('博客接口文档')
    .setVersion('1.0')
    .addServer(`http://${serveConfig.ip}:${serveConfig.prot}`)
    // 添加鉴权
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(serveConfig.apiPath + '/doc', app, document);
  await app.listen(5000);
  Logger.log(`服务已经启动,接口请访问:http://${serveConfig.ip}:${serveConfig.prot}/api/v1`);
  Logger.log(
    `服务已经启动,文档请访问:http://${serveConfig.ip}:${serveConfig.prot}/${serveConfig.apiPath}/doc`,
  );
}
bootstrap();
