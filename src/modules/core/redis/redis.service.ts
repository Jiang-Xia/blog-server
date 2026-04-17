// src/modules/core/redis/redis.service.ts
import { Inject, Injectable } from '@nestjs/common';
import type Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}

  /**
   * 读取指定 key 的字符串值。
   * @param key Redis 键名
   * @returns key 对应的值；不存在时返回 null
   */
  async get(key: string) {
    return this.client.get(key);
  }

  /**
   * 写入字符串值。
   * - 提供 ttlSeconds 时，使用带过期时间的 setex 写入（单位：秒）
   * - 未提供 ttlSeconds 时，写入持久键
   * @param key Redis 键名
   * @param value 字符串值
   * @param ttlSeconds 过期时间（秒）
   */
  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds && ttlSeconds > 0) {
      return this.client.setex(key, ttlSeconds, value);
    }
    return this.client.set(key, value);
  }

  /**
   * 删除指定 key。
   * @param key Redis 键名
   * @returns 删除的键数量（0 或 1）
   */
  async del(key: string) {
    return this.client.del(key);
  }

  /**
   * 对数值型 key 做自增操作（可指定步长）。
   * - key 不存在时，Redis 会先按 0 处理再自增
   * - 常用于计数器场景（例如限流、访问统计）
   * @param key Redis 键名
   * @param increment 自增步长，默认 1
   * @returns 自增后的最新值
   */
  async incrBy(key: string, increment = 1) {
    return this.client.incrby(key, increment);
  }

  /**
   * 设置 key 的过期时间（单位：秒）。
   * @param key Redis 键名
   * @param ttlSeconds 过期时间（秒）
   * @returns 1 表示设置成功，0 表示键不存在或未设置
   */
  async expire(key: string, ttlSeconds: number) {
    return this.client.expire(key, ttlSeconds);
  }
}
