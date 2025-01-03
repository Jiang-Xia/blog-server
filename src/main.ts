/*
 * @Author: 酱
 * @LastEditors: jx
 * @Date: 2021-11-12 17:31:46
 * @LastEditTime: 2024-12-28 23:16:46
 * @Description:
 * @FilePath: \blog-server\src\main.ts
 */
import { NestFactory } from '@nestjs/core';
import { InitConfig } from './config/index';
import { AppModule } from './app.module';
// 全局Http拦截器
import { TransformInterceptor } from './interceptor/transform.interceptor';
// 全局Http异常过滤器
import { HttpExceptionFilter } from './filters/http-execption.filter';
// 全局表单类验证器
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { text, json } from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as session from 'express-session';
import { SessionOptions } from 'express-session';
import { GatewagMiddleware } from './middleware/gateway.middleware';

async function bootstrap() {
  Logger.warn('开始初始化配置==================>');
  const config = InitConfig();
  const serveConfig = config.serveConfig;
  Logger.warn('完成初始化配置==================>');
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: serveConfig.isDev
      ? ['log', 'debug', 'error', 'warn']
      : ['log', 'debug', 'error', 'warn'],
  });
  // 允许跨域
  app.enableCors({
    credentials: true,
    origin: true,
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
  app.use(json({ limit: '5mb' })); // 统一配置http传输设置 解析json
  // app.use(text({ limit: '5mb', type: 'text/xml' })); // json和xml都可以解析
  app.use(GatewagMiddleware); // 需放在body-parser插件后面
  // 配置session
  const sess: SessionOptions = {
    secret: 'jx123!456jx', // 密钥
    name: 'blog.connect.sid', //返回客户端(cookie里面)的 key 的名称 默认为connect.sid
    resave: false, //强制保存
    saveUninitialized: true,
    rolling: false, //每次请求重新设置cookie 过期时间
    cookie: {
      // 5分钟
      maxAge: 300000,
    },
  };
  app.use(session(sess));
  // 自定义插件
  app.use(function (req: any, res: any, next: any) {
    if (!req.session.authCodeCount) {
      req.session.authCodeCount = 0;
    }
    next();
  });
  // 设置api前缀
  app.setGlobalPrefix(serveConfig.apiPath);

  // 配置swagger
  const options = new DocumentBuilder()
    .setTitle('Blog-Server-Api')
    .setDescription('Blog Server 博客接口文档')
    .setVersion('1.0')
    .addServer(serveConfig.baseUrl, '描述')
    // 添加鉴权
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(serveConfig.apiPath + '/doc', app, document);
  await app.listen(5000);
  Logger.log(`服务已经启动,接口请访问:${serveConfig.baseUrl}/${serveConfig.apiPath}`);
  Logger.log(`服务已经启动,文档请访问:${serveConfig.baseUrl}/${serveConfig.apiPath}/doc`);
}
bootstrap();
