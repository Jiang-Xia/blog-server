import { Injectable } from '@nestjs/common';
import { AlipaySdk } from 'alipay-sdk';
import { Config } from '../../config';

import { TradeCreateDto } from './dto/trade-create.dto';
import { TradeQueryDto } from './dto/trade-query.dto';
import { TradeRefundDto } from './dto/trade-refund.dto';
import { TradeCloseDto } from './dto/trade-close.dto';
import { GetOpenIdDto } from './dto/get-openid.dto';

@Injectable()
export class PayService {
  private sdk: any;

  constructor() {
    this.sdk = new AlipaySdk({
      appId: Config.payConfig.alipayAppId,
      privateKey: Config.payConfig.alipayPrivateKey,
      alipayPublicKey: Config.payConfig.alipayPublicKey,
      // gateway: Config.payConfig.alipayGateway,
      // signType: Config.payConfig.alipaySignType,
      // timeout: Config.payConfig.alipayTimeout,
    });
  }

  async tradeCreate(dto: TradeCreateDto) {
    const result = await this.sdk.exec('alipay.trade.create', { bizContent: dto });
    return result;
  }

  async tradeQuery(dto: TradeQueryDto) {
    const result = await this.sdk.exec('alipay.trade.query', { bizContent: dto });
    return result;
  }

  async tradeRefund(dto: TradeRefundDto) {
    const result = await this.sdk.exec('alipay.trade.refund', { bizContent: dto });
    return result;
  }

  async tradeClose(dto: TradeCloseDto) {
    const result = await this.sdk.exec('alipay.trade.close', { bizContent: dto });
    return result;
  }

  /**
   * 根据支付宝小程序code获取openid
   * @param dto 包含code的DTO
   * @returns 返回openid（即user_id）
   */
  async getOpenIdByCode(dto: GetOpenIdDto) {
    const result = await this.sdk.exec('alipay.system.oauth.token', {
      grant_type: 'authorization_code',
      code: dto.code,
    });
    return result;
  }
}


