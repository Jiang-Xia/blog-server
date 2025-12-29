import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RedisClientService implements OnModuleInit {
  private redisService: any;

  constructor(@Inject('REDIS_GRPC_SERVICE') private client) {}

  async onModuleInit() {
    this.redisService = this.client.getService('RedisService');
  }

  async get(key: string): Promise<string> {
    const response: any = await lastValueFrom(this.redisService.Get({ key }));
    return response.value;
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<boolean> {
    const response: any = await lastValueFrom(this.redisService.Set({ key, value, ttlSeconds }));
    return response.success;
  }

  async del(key: string): Promise<number> {
    const response: any = await lastValueFrom(this.redisService.Del({ key }));
    return response.deletedCount;
  }

  async incrBy(key: string, increment = 1): Promise<number> {
    const response: any = await lastValueFrom(this.redisService.IncrBy({ key, increment }));
    return response.newValue;
  }
}
