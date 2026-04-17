// src/modules/security/captcha/captcha.controller.ts
import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CaptchaService } from './captcha.service';
import { IpAddress } from 'src/utils/common';
import type { Request, Response } from 'express';
import { randomUUID } from 'crypto';
import { Config } from '../../../config';

@Controller('captcha')
export class CaptchaController {
  constructor(private readonly service: CaptchaService) {}

  @Get()
  async getCaptcha(
    @IpAddress() ip: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    let browserId = (req as any).cookies?.browser_id as string | undefined;
    if (!browserId) {
      browserId = randomUUID().replace(/-/g, '');
      res.cookie('browser_id', browserId, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
        sameSite: 'lax',
        secure: !Config.serveConfig.isDev,
        path: '/',
      });
    }
    const identity = ip && ip !== 'unknown' ? `ip:${ip}` : `bid:${browserId}`;
    await this.service.assertCaptchaRateLimit(identity);
    return this.service.create();
  }

  @Post('verify')
  async verify(@Body() body: { id: string; answer: string }) {
    const ok = await this.service.verify(body.id, body.answer);
    return { ok };
  }
}
