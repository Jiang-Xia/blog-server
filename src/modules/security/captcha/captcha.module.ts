// src/modules/security/captcha/captcha.module.ts
import { Module } from '@nestjs/common';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';
import { RedisGrpcModule } from '../../features/grpc/redis-grpc.module';

@Module({
  imports: [RedisGrpcModule],
  controllers: [CaptchaController],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
