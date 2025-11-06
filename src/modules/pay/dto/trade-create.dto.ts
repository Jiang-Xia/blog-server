import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class TradeCreateDto {
  @ApiPropertyOptional({ description: '商户订单号，与 trade_no 二选一',example: '20150320010101001' })
  @IsOptional()
  @IsString()
  out_trade_no?: string;

  @ApiPropertyOptional({ description: '支付宝交易号，与 out_trade_no 二选一',example: '20150320010101001' })
  @IsOptional()
  @IsString()
  trade_no?: string;

  @ApiPropertyOptional({ description: '订单标题',example: '商品名称' })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({ description: '买家支付宝用户唯一标识 buyer_open_id',example: '074a1CcTG1LelxKe4xQC0zgNdId0nxi95b5lsNpazWYoCo5' })
  @IsOptional()
  @IsString()
  buyer_open_id?: string;

  @ApiPropertyOptional({ description: '订单总金额，单位元，精确到小数点后两位',example: '88.88' })
  @IsOptional()
  @IsNumberString()
  total_amount?: string;

  @ApiPropertyOptional({ description: '可透传自定义字段',example: { key: 'value' } })
  @IsOptional()
  extend_params?: Record<string, any>;
}


