// src/modules/user/dto/register.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { regUserAccount } from 'src/utils/regex.util';
export class resetPassword {
  @ApiProperty({
    description: '账号，唯一',
    example: '13049153466',
  })
  // @ValidateIf((o) => !o.username)
  @IsNotEmpty({ message: '请输入账号' })
  @MinLength(6, { message: '账号至少需要6个字符' })
  @MaxLength(11, { message: '账号不能超过11个字符' })
  @Matches(regUserAccount, { message: '账号只允许字母、数字、中划线' })
  readonly mobile: string;

  @ApiProperty({
    description: '用户名',
    example: 'jinagxia',
  })
  readonly username?: string;

  @ApiProperty({
    description: '用户昵称',
    example: '江夏',
  })
  @IsNotEmpty({ message: '请输入用户昵称' })
  @IsString({ message: '名字必须是 String 类型' })
  @MaxLength(6, { message: '账号不能超过6个字符' })
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
  @MinLength(6, { message: '密码至少需要6个字符' })
  @MaxLength(18, { message: '密码不能超过18个字符' })
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
