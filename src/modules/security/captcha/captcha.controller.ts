// src/modules/security/captcha/captcha.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CaptchaService } from './captcha.service';

@Controller('captcha')
export class CaptchaController {
	constructor(private readonly service: CaptchaService) {}

	@Get()
	async getCaptcha() {
		return this.service.create();
	}

	@Post('verify')
	async verify(@Body() body: { id: string; answer: string }) {
		const ok = await this.service.verify(body.id, body.answer);
		return { ok };
	}
}