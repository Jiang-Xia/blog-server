import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 全局Http拦截器
import { TransformInterceptor } from './interceptor/transform.interceptor';
// 全局Http异常过滤器
import { HttpExceptionFilter } from './filters/http-execption.filter';
// 全局表单类验证器
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
