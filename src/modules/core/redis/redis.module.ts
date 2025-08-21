// src/modules/core/redis/redis.module.ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import Redis from 'ioredis';
import { Config } from 'src/config';
@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      useFactory: () =>
        new Redis({
          host: Config.redisConfig.host,
          port: Config.redisConfig.port,
          password: Config.redisConfig.password || undefined,
          db: Config.redisConfig.db || 1,
        }),
    },
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
