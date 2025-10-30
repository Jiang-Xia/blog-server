// src/modules/user/dto/email-login.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class EmailLoginDTO {
  @ApiProperty({
    description: '邮箱地址',
    example: 'jiangxia2048@163.com',
  })
  @IsEmail({}, { message: '请输入正确的邮箱地址' })
  @IsNotEmpty({ message: '请输入邮箱' })
  readonly email: string;

  @ApiProperty({
    description: '用户密码',
    example: '123456',
  })
  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string;

  @ApiProperty({
    description: '邮箱验证码',
    example: '123456',
  })
  @IsNotEmpty({ message: '请输入邮箱验证码' })
  readonly verificationCode: string;

  @ApiProperty({
    description: 'admin端',
    example: true,
  })
  readonly admin?: boolean;
}
