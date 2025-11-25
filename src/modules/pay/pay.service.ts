import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AlipaySdk } from 'alipay-sdk';
import { Config } from '../../config';
import { lastValueFrom } from 'rxjs';

import { TradeCreateDto } from './dto/trade-create.dto';
import { TradeQueryDto } from './dto/trade-query.dto';
import { TradeRefundDto } from './dto/trade-refund.dto';
import { TradeCloseDto } from './dto/trade-close.dto';
import { GetOpenIdDto } from './dto/get-openid.dto';
import { H5OpenMiniDto } from './dto/h5-open-mini.dto';

@Injectable()
export class PayService {
  private sdk: any;

  constructor(private readonly httpService: HttpService) {
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
    const result = await this.sdk.exec('alipay.trade.query', { bizContent: { ...dto } });
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
   * 获取微信access_token
   * 通过调用 https://api.weixin.qq.com/cgi-bin/token 接口获取
   */
  private async getWechatAccessToken(): Promise<string> {
    // 从配置中获取微信appId和secret
    const appId = Config.payConfig.wechatAppId;
    const secret = Config.payConfig.wechatSecret || '';

    try {
      // 调用微信获取access_token接口
      const response = await lastValueFrom(
        this.httpService.get(
          `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`,
        ),
      );

      if (response.data.access_token) {
        return response.data.access_token;
      } else {
        throw new Error(`获取微信access_token失败: ${response.data.errmsg}`);
      }
    } catch (error) {
      console.error('获取微信access_token失败:', error);
      throw new Error('获取微信access_token失败');
    }
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
  async buildH5OpenMiniUrl(dto: H5OpenMiniDto) {
    if (dto.type === 'wechat') {
      // 处理微信小程序逻辑
      return await this.buildWechatMiniProgramUrl(dto);
    } else {
      // 默认处理支付宝小程序逻辑
      const configuredAppId = Config.payConfig.alipayAppId;
      const appId = dto.appId || configuredAppId;
      const page = dto.page?.startsWith('/') ? dto.page.slice(1) : dto.page;
      const queryString = dto.query ? new URLSearchParams(dto.query as any).toString() : '';
      const pageParam = queryString ? `${page}?${queryString}` : page;
      // 页面参数需要需要再page上面，文档写的query参数只是小程序启动参数
      const scheme = `alipays://platformapi/startapp?appId=${encodeURIComponent(appId)}${pageParam ? `&page=${encodeURIComponent(pageParam)}` : ''}`;
      const universalLink = `https://render.alipay.com/p/s/i?scheme=${encodeURIComponent(scheme)}`;
      return { scheme, universalLink };
    }
  }

  /**
   * 生成在 H5 中拉起微信小程序特定页面的链接
   */
  private async buildWechatMiniProgramUrl(dto: H5OpenMiniDto) {
    // 微信小程序的页面路径
    const path = dto.page || '';
    // 构造页面参数
    const queryString = dto.query ? new URLSearchParams(dto.query as any).toString() : '';
    // 构造微信小程序URL Scheme请求参数
    const requestData: any = {
      jump_wxa: {
        path: path,
        env_version: dto.version,
      },
    };
    // 如果有查询参数，则添加到jump_wxa对象中
    if (queryString) {
      requestData.jump_wxa.query = queryString;
    }
    try {
      // 动态获取access_token
      const accessToken = await this.getWechatAccessToken();
      // 调用微信生成URL Scheme接口
      console.log('调用微信生成URL Scheme接口 requestData:', { accessToken, ...requestData });
      const response = await lastValueFrom(
        this.httpService.post(
          `https://api.weixin.qq.com/wxa/generatescheme?access_token=${accessToken}`,
          requestData,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      if (response.data.errcode === 0) {
        // 成功返回URL Scheme
        const scheme = response.data.openlink + (queryString ? `&${queryString}` : '');
        return { scheme, universalLink: scheme };
      } else {
        // 微信接口返回错误
        throw new Error(`微信接口调用失败: ${response.data.errmsg}`);
      }
    } catch (error) {
      // 网络错误或其他异常
      console.error('调用微信生成URL Scheme接口失败:', error);
      throw new Error('生成微信小程序链接失败');
    }
  }
}
