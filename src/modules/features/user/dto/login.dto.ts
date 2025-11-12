import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength, Matches } from 'class-validator';
import { regUserAccount } from 'src/utils/regex.util';

export class LoginDTO {
  @ApiProperty({
    description: '账号，唯一',
    example: '13049153466',
  })
  @IsNotEmpty({ message: '请输入账号' })
  @MinLength(6, { message: '账号至少需要6个字符' })
  @MaxLength(11, { message: '账号不能超过11个字符' })
  @Matches(regUserAccount, { message: '账号只允许字母、数字、中划线' })
  readonly mobile: string;

  @ApiProperty({
    description: '用户密码',
    example: '123456',
  })
  @IsNotEmpty({ message: '请输入密码' })
  readonly password: string;

  @ApiProperty({
    description: '用户名',
    example: 'jinagxia',
  })
  readonly username?: string;

  @IsNotEmpty({ message: '请输入验证码' })
  readonly authCode: string;

  @ApiProperty({
    description: 'admin端',
    example: true,
  })
  readonly admin?: boolean;
}
