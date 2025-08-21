// src/modules/security/captcha/captcha.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RedisService } from '../../core/redis/redis.service';
import { randomUUID } from 'crypto';
import svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
  constructor(private readonly redis: RedisService) {}

  /**
   * 生成图形验证码，并将答案以一次性键写入 Redis。
   *
   * - 验证码为 4 位，区分度较低的字符会被忽略（如 0/O、1/l 等）
   * - 默认有效期为 120 秒，过期后将自动失效
   * - 答案以小写形式保存，校验时不区分大小写
   *
   * @param ttlSeconds 验证码在 Redis 中的存活时间（秒），默认 120 秒
   * @returns 包含验证码唯一标识 `id` 与 SVG 内容 `svg`
   */
  async create(ttlSeconds = 120): Promise<{ id: string; svg: string }> {
    const { text, data } = svgCaptcha.create({
      size: 4, // 生成几个验证码
      fontSize: 50, // 文字大小
      ignoreChars: '0o1iIlL', // 忽略易混淆字符
      charPreset: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
      noise: 2, // 干扰线条数量
      width: 100, // 宽度
      height: 48, // 高度
      background: 'transparent', // 背景颜色（透明）
    });

    const id = randomUUID().replace(/-/g, '');
    await this.redis.set(`captcha:${id}`, text.toLowerCase(), ttlSeconds);
    return { id, svg: data };
  }

  /**
   * 校验验证码答案。该操作为一次性校验：
   * - 若 Redis 中不存在（过期或已校验过），返回 false
   * - 校验成功或失败后，均会删除对应键，防止重复使用
   *
   * @param id 验证码唯一标识
   * @param answer 用户输入的答案
   * @returns 是否校验通过
   */
  async verify(id: string, answer: string): Promise<boolean> {
    const key = `captcha:${id}`;
    const expected = await this.redis.get(key);
    if (!expected) {
      throw new InternalServerErrorException('验证码已过期');
    }
    await this.redis.del(key); // 一次性使用
    if (expected === String(answer || '').toLowerCase()) {
      // console.log('验证码校验成功')
      return true;
    } else {
      throw new InternalServerErrorException('验证码错误');
    }
  }
}
