import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, IsString } from 'class-validator';

export class TradeRefundDto {
  @ApiPropertyOptional({ description: '商户订单号，与 trade_no 二选一' })
  @IsOptional()
  @IsString()
  out_trade_no?: string;

  @ApiPropertyOptional({ description: '支付宝交易号，与 out_trade_no 二选一' })
  @IsOptional()
  @IsString()
  trade_no?: string;

  @ApiPropertyOptional({ description: '退款金额，单位元' })
  @IsString()
  @IsNumberString()
  refund_amount!: string;

  @ApiPropertyOptional({ description: '退款原因' })
  @IsOptional()
  @IsString()
  refund_reason?: string;

  @ApiPropertyOptional({ description: '退款请求号，支持部分退款幂等' })
  @IsOptional()
  @IsString()
  out_request_no?: string;
}
