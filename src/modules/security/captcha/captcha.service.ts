// src/modules/security/captcha/captcha.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from '../../core/redis/redis.service';
import { CAPTCHA_GRAPHIC_REFRESH_BIZ_CODE } from '../../../constants/api-error-codes';
import { randomUUID } from 'crypto';
import svgCaptcha from 'svg-captcha';

/** 同一身份拉取图形验证码：60 秒窗口内最多成功生成次数（自首次请求起计） */
const CAPTCHA_RATE_WINDOW_SEC = 60;
const CAPTCHA_RATE_MAX_PER_WINDOW = 5;
/** 同一验证码最多允许输错次数，超出后强制作废 */
const CAPTCHA_VERIFY_MAX_ATTEMPTS = 5;
/** 验证码错误计数键的有效期（秒），与验证码存活周期保持一致 */
const CAPTCHA_VERIFY_ATTEMPT_TTL_SEC = 120;

function toRedisSafeIdentitySegment(value: string): string {
  // Redis key 里统一使用安全字符，避免 IPv6 冒号等分隔符带来歧义
  return value.replace(/[^0-9a-zA-Z._-]/g, '_');
}

@Injectable()
export class CaptchaService {
  constructor(private readonly redis: RedisService) {}

  /**
   * 按“客户端身份”限制图形验证码生成频率（Redis 计数 + 固定窗口）。
   * - 优先用真实 IP
   * - 若 IP 不可用，应传入稳定的匿名身份（如 httpOnly cookie 的 browserId），避免落到同一个 unknown 造成全局限流
   * 需在每次生成验证码前调用。
   */
  async assertCaptchaRateLimit(clientIdentity: string): Promise<void> {
    const identity = (clientIdentity || 'unknown').trim() || 'unknown';
    const safeSegment = toRedisSafeIdentitySegment(identity);
    const key = `captcha:rate:${safeSegment}`;
    const count = await this.redis.incrBy(key, 1);
    if (count === 1) {
      await this.redis.expire(key, CAPTCHA_RATE_WINDOW_SEC);
    }
    // 调试用：观察限流 key 与计数是否符合预期
    // console.log('[CaptchaRateLimit]', {
    //   rawIp: ip,
    //   safeIpSegment,
    //   redisKey: key,
    //   count,
    //   windowSec: CAPTCHA_RATE_WINDOW_SEC,
    //   maxPerWindow: CAPTCHA_RATE_MAX_PER_WINDOW,
    // });
    if (count > CAPTCHA_RATE_MAX_PER_WINDOW) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: '验证码获取过于频繁，请稍后再试',
          bizCode: CAPTCHA_GRAPHIC_REFRESH_BIZ_CODE,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

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
    // 单独记录同一验证码的输错次数，避免暴力猜解
    const attemptKey = `captcha:attempt:${id}`;
    const expected = await this.redis.get(key);
    if (!expected) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: '验证码已过期',
          bizCode: CAPTCHA_GRAPHIC_REFRESH_BIZ_CODE,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    const normalizedAnswer = String(answer || '')
      .trim()
      .toLowerCase();
    if (expected === normalizedAnswer) {
      await this.redis.del(key);
      await this.redis.del(attemptKey);
      // console.log('验证码校验成功')
      return true;
    }

    const attempts = await this.redis.incrBy(attemptKey, 1);
    if (attempts === 1) {
      // 首次输错时才设置过期，形成固定时间窗口
      await this.redis.expire(attemptKey, CAPTCHA_VERIFY_ATTEMPT_TTL_SEC);
    }
    if (attempts >= CAPTCHA_VERIFY_MAX_ATTEMPTS) {
      await this.redis.del(key);
      await this.redis.del(attemptKey);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: '验证码错误次数过多，请刷新后重试',
          bizCode: CAPTCHA_GRAPHIC_REFRESH_BIZ_CODE,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    throw new HttpException(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: '验证码错误',
        bizCode: CAPTCHA_GRAPHIC_REFRESH_BIZ_CODE,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
