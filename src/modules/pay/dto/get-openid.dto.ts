import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetOpenIdDto {
  @ApiProperty({ description: '支付宝小程序获取的授权码code', example: 'xxxxx' })
  @IsNotEmpty()
  @IsString()
  code: string;

  @ApiProperty({ description: '支付宝小程序获取的授权码code', example: 'alipay',default: 'alipay' })
  @IsNotEmpty()
  @IsString()
  type: string = 'alipay';
  
}

