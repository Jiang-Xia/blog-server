import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { RedisService } from '../../core/redis/redis.service';
import { Config } from '../../../config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly redisService: RedisService) {
    // 创建邮件传输器
    this.transporter = nodemailer.createTransport({
      host: Config.appConfig.emailHost || 'smtp.163.com', // 163邮箱SMTP服务器
      port: Config.appConfig.emailPort || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: Config.appConfig.emailUser, // 发送方邮箱
        pass: Config.appConfig.emailPass, // 邮箱授权码
      },
    });
  }

  /**
   * 生成6位数字验证码
   */
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 发送邮箱验证码
   * @param email 邮箱地址
   * @param type 验证码类型：register | login | reset
   */
  async sendVerificationCode(
    email: string,
    type: 'register' | 'login' | 'reset' = 'register',
  ): Promise<void> {
    try {
      // 生成验证码
      const code = this.generateVerificationCode();

      // 验证码存储到Redis，有效期5分钟
      const redisKey = `email_verification_code:${type}:${email}`;
      await this.redisService.set(redisKey, code, 5 * 60);

      // 根据类型设置邮件标题和内容
      let subject: string;
      let content: string;

      switch (type) {
        case 'register':
          subject = '欢迎注册 - 邮箱验证码';
          content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h2 style="color: #333;">欢迎注册我们的服务</h2>
              <p>您正在进行邮箱注册，验证码为：</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; color: #007bff; font-weight: bold; letter-spacing: 3px;">${code}</span>
              </div>
              <p style="color: #666;">验证码有效期为5分钟，请尽快使用。</p>
              <p style="color: #999; font-size: 12px;">如果这不是您的操作，请忽略此邮件。</p>
            </div>
          `;
          break;
        case 'login':
          subject = '登录验证 - 邮箱验证码';
          content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h2 style="color: #333;">登录验证</h2>
              <p>您正在进行邮箱登录，验证码为：</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; color: #28a745; font-weight: bold; letter-spacing: 3px;">${code}</span>
              </div>
              <p style="color: #666;">验证码有效期为5分钟，请尽快使用。</p>
              <p style="color: #999; font-size: 12px;">如果这不是您的操作，请立即修改密码或联系客服。</p>
            </div>
          `;
          break;
        case 'reset':
          subject = '密码重置 - 邮箱验证码';
          content = `
            <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
              <h2 style="color: #333;">密码重置验证</h2>
              <p>您正在进行密码重置，验证码为：</p>
              <div style="background: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0;">
                <span style="font-size: 24px; color: #dc3545; font-weight: bold; letter-spacing: 3px;">${code}</span>
              </div>
              <p style="color: #666;">验证码有效期为5分钟，请尽快使用。</p>
              <p style="color: #999; font-size: 12px;">如果这不是您的操作，请立即联系客服。</p>
            </div>
          `;
          break;
      }

      // 发送邮件
      await this.transporter.sendMail({
        from: `"江夏的博客系统" <${Config.appConfig.emailUser}>`,
        to: email,
        subject,
        html: content,
      });
    } catch (error) {
      console.error('发送邮件失败:', error);
      throw new HttpException('邮件发送失败，请稍后重试', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 验证邮箱验证码
   * @param email 邮箱地址
   * @param code 验证码
   * @param type 验证码类型
   */
  async verifyCode(
    email: string,
    code: string,
    type: 'register' | 'login' | 'reset' = 'register',
  ): Promise<boolean> {
    try {
      const redisKey = `email_verification_code:${type}:${email}`;
      const storedCode = await this.redisService.get(redisKey);

      if (!storedCode) {
        throw new HttpException('验证码已过期或不存在', HttpStatus.BAD_REQUEST);
      }

      if (storedCode !== code) {
        throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
      }

      // 验证成功后删除验证码
      await this.redisService.del(redisKey);
      return true;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('验证码验证失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 检查验证码发送频率限制
   * @param email 邮箱地址
   */
  async checkSendFrequency(email: string, type: string): Promise<void> {
    const frequencyKey = `email_send_frequency:${type}:${email}`;
    const lastSendTime = await this.redisService.get(frequencyKey);

    if (lastSendTime) {
      throw new HttpException('请求过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
    }

    // 设置60秒的发送间隔限制
    await this.redisService.set(frequencyKey, Date.now().toString(), 60);
  }
}
