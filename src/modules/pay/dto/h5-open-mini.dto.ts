import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class H5OpenMiniDto {
  @ApiProperty({ description: '小程序页面路径，如 pages/index 或 pages/index/index' })
  @IsString()
  page!: string;

  @ApiPropertyOptional({ description: '页面参数对象，将被序列化到 query 上' })
  @IsOptional()
  @IsObject()
  query?: Record<string, any>;

  @ApiPropertyOptional({ description: '可选，指定小程序 appId，不传则使用配置值' })
  @IsOptional()
  @IsString()
  appId?: string;

  @ApiPropertyOptional({ description: '微信或者支付宝',default: 'alipay',example: 'alipay' })
  @IsNotEmpty()
  @IsString()
  type: string = 'alipay';  
}


