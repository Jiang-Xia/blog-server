// src/modules/user/dto/register.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { extend } from 'dayjs';
import { regMobileCN } from 'src/utils/regex.util';
export class resetPassword {
  @ApiProperty({
    description: '手机号，唯一',
    example: '13049153466',
  })
  @Matches(regMobileCN, { message: '请输入正确手机号' })
  @IsNotEmpty({ message: '请输入手机号' })
  readonly mobile: string;

  @ApiProperty({
    description: '用户名',
    example: '江夏',
  })
  @IsNotEmpty({ message: '请输入用户昵称' })
  @IsString({ message: '名字必须是 String 类型' })
  readonly nickname: string;

  @IsNotEmpty({ message: '请输入验证码' })
  readonly authCode?: string;
}
export class RegisterDTO extends resetPassword {
  @ApiProperty({
    description: '用户密码',
    example: '123456',
  })
  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string;

  @ApiProperty({
    description: '二次输入密码',
    example: '123456',
  })
  @IsNotEmpty({ message: '请再次输入密码' })
  readonly passwordRepeat: string;

  readonly role?: string;

  readonly avatar?: string;
}
