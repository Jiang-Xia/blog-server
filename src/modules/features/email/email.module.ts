import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { RedisGrpcModule } from '../grpc/redis-grpc.module';

@Module({
  imports: [RedisGrpcModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
