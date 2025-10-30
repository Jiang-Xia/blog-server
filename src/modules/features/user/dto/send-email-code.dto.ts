// src/modules/user/dto/send-email-code.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsEnum } from 'class-validator';

export enum EmailCodeType {
  REGISTER = 'register',
  LOGIN = 'login',
  RESET = 'reset',
}

export class SendEmailCodeDTO {
  @ApiProperty({
    description: '邮箱地址',
    example: 'jiangxia2048@163.com',
  })
  @IsEmail({}, { message: '请输入正确的邮箱地址' })
  @IsNotEmpty({ message: '请输入邮箱' })
  readonly email: string;

  @ApiProperty({
    description: '验证码类型',
    example: 'register',
    enum: EmailCodeType,
  })
  @IsEnum(EmailCodeType, { message: '验证码类型错误' })
  @IsNotEmpty({ message: '请指定验证码类型' })
  readonly type: EmailCodeType;
}
