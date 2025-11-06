import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class TradeCloseDto {
  @ApiPropertyOptional({ description: '商户订单号，与 trade_no 二选一' })
  @IsOptional()
  @IsString()
  out_trade_no?: string;

  @ApiPropertyOptional({ description: '支付宝交易号，与 out_trade_no 二选一' })
  @IsOptional()
  @IsString()
  trade_no?: string;
}


