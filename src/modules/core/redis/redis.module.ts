// src/modules/core/redis/redis.module.ts
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import Redis from 'ioredis';

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		RedisService,
		{
			provide: 'REDIS_CLIENT',
			inject: [ConfigService],
			useFactory: (config: ConfigService) =>
				new Redis({
					host: config.get<string>('REDIS_HOST') || '127.0.0.1',
					port: Number(config.get<number>('REDIS_PORT') || 6379),
					password: config.get<string>('REDIS_PASSWORD') || undefined,
					db: Number(config.get<number>('REDIS_DB') || 0),
				}),
		},
	],
	exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}