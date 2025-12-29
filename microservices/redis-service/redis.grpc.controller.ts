import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { RedisServiceImpl } from './redis.service.impl';

@Controller()
export class RedisGrpcController {
  constructor(private readonly redisService: RedisServiceImpl) {}

  @GrpcMethod('RedisService', 'Get')
  async get(request: { key: string }) {
    return this.redisService.Get(request);
  }

  @GrpcMethod('RedisService', 'Set')
  async set(request: { key: string; value: string; ttlSeconds?: number }) {
    return this.redisService.Set(request);
  }

  @GrpcMethod('RedisService', 'Del')
  async del(request: { key: string }) {
    return this.redisService.Del(request);
  }

  @GrpcMethod('RedisService', 'IncrBy')
  async incrBy(request: { key: string; increment: number }) {
    return this.redisService.IncrBy(request);
  }
}
