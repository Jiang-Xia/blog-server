import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import Redis from 'ioredis';

// 导入proto定义的类型
export interface GetRequest {
  key: string;
}

export interface GetResponse {
  value: string;
}

export interface SetRequest {
  key: string;
  value: string;
  ttlSeconds?: number;
}

export interface SetResponse {
  success: boolean;
}

export interface DelRequest {
  key: string;
}

export interface DelResponse {
  deletedCount: number;
}

export interface IncrByRequest {
  key: string;
  increment: number;
}

export interface IncrByResponse {
  newValue: number;
}

@Injectable()
export class RedisServiceImpl {
  private redis: Redis;

  constructor() {
    // 创建Redis连接，使用环境变量配置
    const redisHost = process.env.REDIS_HOST || '127.0.0.1';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379');
    const redisPassword = process.env.REDIS_PASSWORD || undefined;
    const redisDb = parseInt(process.env.REDIS_DB || '1');
    
    this.redis = new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      db: redisDb,
    });
    
    // 监听Redis连接事件
    this.redis.on('connect', () => {
      console.log('Connected to Redis server');
    });
    
    this.redis.on('error', (err) => {
      console.error('Redis connection error:', err);
    });
  }

  async Get(request: GetRequest): Promise<GetResponse> {
    const value = await this.redis.get(request.key);
    return { value: value || '' };
  }

  async Set(request: SetRequest): Promise<SetResponse> {
    let result: boolean | 'OK';
    if (request.ttlSeconds && request.ttlSeconds > 0) {
      result = await this.redis.setex(request.key, request.ttlSeconds, request.value);
    } else {
      result = await this.redis.set(request.key, request.value);
    }
    return { success: result === 'OK' || result === true };
  }

  async Del(request: DelRequest): Promise<DelResponse> {
    const result = await this.redis.del(request.key);
    return { deletedCount: result };
  }

  async IncrBy(request: IncrByRequest): Promise<IncrByResponse> {
    const result = await this.redis.incrby(request.key, request.increment);
    return { newValue: result };
  }

  // 提供一个方法来关闭Redis连接
  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}
