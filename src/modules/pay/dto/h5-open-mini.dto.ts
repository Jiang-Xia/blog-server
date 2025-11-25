import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class H5OpenMiniDto {
  @ApiProperty({
    description: '小程序页面路径，如 pages/index 或 pages/index/index',
    default: 'packageB/pages/business/pay/cashier/cashier',
  })
  @IsString()
  page!: string;

  @ApiPropertyOptional({ description: '页面参数对象，将被序列化到 query 上' })
  @IsOptional()
  @IsObject()
  query?: Record<string, any>;

  @ApiPropertyOptional({ description: '可选，指定小程序 appId，不传则使用配置值', default: '' })
  @IsOptional()
  @IsString()
  appId?: string;

  @ApiPropertyOptional({ description: '微信或者支付宝', default: 'alipay', example: 'alipay' })
  @IsNotEmpty()
  @IsString()
  type: string = 'alipay';

  @ApiPropertyOptional({
    description: '小程序版本，可选值有：develop（开发版），trial（体验版），release（正式版）',
    default: 'release',
    example: 'release',
  })
  @IsNotEmpty()
  @IsString()
  version: string = 'release';
}
