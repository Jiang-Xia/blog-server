import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisModule } from '../../core/redis/redis.module';

@Module({
  imports: [RedisModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
