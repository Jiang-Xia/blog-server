import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { PayService } from './pay.service';
import { TradeCreateDto } from './dto/trade-create.dto';
import { TradeQueryDto } from './dto/trade-query.dto';
import { TradeRefundDto } from './dto/trade-refund.dto';
import { TradeCloseDto } from './dto/trade-close.dto';
import { GetOpenIdDto } from './dto/get-openid.dto';
import { H5OpenMiniDto } from './dto/h5-open-mini.dto';

@ApiTags('支付')
@Controller('pay')
export class PayController {
  constructor(private readonly payService: PayService) {}

  @ApiOperation({ summary: '交易创建 alipay.trade.create' })
  @Post('trade/create')
  async tradeCreate(@Body() dto: TradeCreateDto) {
    return await this.payService.tradeCreate(dto);
  }

  @ApiOperation({ summary: '交易查询 alipay.trade.query' })
  @Get('trade/query')
  async tradeQuery(@Query() dto: TradeQueryDto) {
    return await this.payService.tradeQuery(dto);
  }

  @ApiOperation({ summary: '交易退款 alipay.trade.refund' })
  @Post('trade/refund')
  async tradeRefund(@Body() dto: TradeRefundDto) {
    return await this.payService.tradeRefund(dto);
  }

  @ApiOperation({ summary: '交易关闭 alipay.trade.close' })
  @Post('trade/close')
  async tradeClose(@Body() dto: TradeCloseDto) {
    return await this.payService.tradeClose(dto);
  }

  @ApiOperation({ summary: '根据支付宝小程序code获取openid' })
  @Post('openid')
  async getOpenId(@Body() dto: GetOpenIdDto) {
    return await this.payService.getOpenIdByCode(dto);
  }

  @ApiOperation({ summary: '生成 H5 拉起支付宝小程序页面链接' })
  @Post('h5-open-mini')
  async buildH5OpenMiniUrl(@Body() dto: H5OpenMiniDto) {
    return this.payService.buildH5OpenMiniUrl(dto);
  }
}


