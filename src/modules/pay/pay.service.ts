import { Injectable } from '@nestjs/common';
import { AlipaySdk } from 'alipay-sdk';
import { Config } from '../../config';

import { TradeCreateDto } from './dto/trade-create.dto';
import { TradeQueryDto } from './dto/trade-query.dto';
import { TradeRefundDto } from './dto/trade-refund.dto';
import { TradeCloseDto } from './dto/trade-close.dto';
import { GetOpenIdDto } from './dto/get-openid.dto';
import { H5OpenMiniDto } from './dto/h5-open-mini.dto';

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

  /**
   * 生成在 H5 中拉起支付宝小程序特定页面的链接
   */
  buildH5OpenMiniUrl(dto: H5OpenMiniDto) {
    const configuredAppId = Config.payConfig.alipayAppId;
    const appId = dto.appId || configuredAppId;
    const page = dto.page?.startsWith('/') ? dto.page.slice(1) : dto.page;
    const queryString = dto.query ? new URLSearchParams(dto.query as any).toString() : '';
    const pageParam = queryString ? `${page}?${queryString}` : page;
    const scheme = `alipays://platformapi/startapp?appId=${encodeURIComponent(appId)}${pageParam ? `&page=${encodeURIComponent(pageParam)}` : ''}`;
    const universalLink = `https://render.alipay.com/p/s/i?scheme=${encodeURIComponent(scheme)}`;
    return { scheme, universalLink };
  }
}


