import { Module } from '@nestjs/common';
import { RedisServiceImpl } from './redis.service.impl';
import { RedisGrpcController } from './redis.grpc.controller';

@Module({
  providers: [RedisServiceImpl],
  controllers: [RedisGrpcController],
})
export class RedisServerModule {}
