// src/modules/security/captcha/captcha.service.ts
import { Injectable } from '@nestjs/common';
import { RedisService } from '../../core/redis/redis.service';
import { randomUUID } from 'crypto';
import svgCaptcha from 'svg-captcha';

@Injectable()
export class CaptchaService {
	constructor(private readonly redis: RedisService) {}

	async create(ttlSeconds = 120) {
		const { text, data } = svgCaptcha.create({
			size: 4,
			noise: 2,
			color: true,
			ignoreChars: '0oO1il',
			width: 120,
			height: 44,
		});
		const id = randomUUID();
		await this.redis.set(`captcha:${id}`, text.toLowerCase(), ttlSeconds);
		return { id, svg: data };
	}

	async verify(id: string, answer: string) {
		const key = `captcha:${id}`;
		const expected = await this.redis.get(key);
		if (!expected) return false;
		await this.redis.del(key); // 一次性使用
		return expected === String(answer || '').toLowerCase();
	}
}