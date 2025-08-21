// src/modules/security/captcha/captcha.module.ts
import { Module } from '@nestjs/common';
import { CaptchaController } from './captcha.controller';
import { CaptchaService } from './captcha.service';
import { RedisModule } from '../../core/redis/redis.module';

@Module({
  imports: [RedisModule],
  controllers: [CaptchaController],
  providers: [CaptchaService],
  exports: [CaptchaService],
})
export class CaptchaModule {}
