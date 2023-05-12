import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Msgboard } from './msgboard.entity';
import { UAParser } from 'ua-parser-js';
import { MD5 } from 'crypto-js';
import { map } from 'rxjs/operators';
import { lastValueFrom } from 'rxjs';
import { isIPv4 } from 'node:net';

// 后端还是一个个模块分开写比较清晰，集合再一起久了，不清晰功能下载哪里了！
@Injectable()
export class MsgboardService {
  constructor(
    @InjectRepository(Msgboard)
    private readonly msgboardRepository: Repository<Msgboard>,
    private readonly httpService: HttpService,
  ) {}
  async create(msgboard: Partial<Msgboard>, req: any, ip: string): Promise<Msgboard> {
    const parser = new UAParser(req.headers['user-agent']); // you need to pass the user-agent for nodejs
    const parserResults = parser.getResult();
    if (ip.indexOf('::ffff:') !== -1) {
      ip = ip.substring(7);
    }
    const info: any = await this.getIPInfo(ip);
    console.log({
      info,
      ip,
      parserResults,
    });
    if (!msgboard.avatar) {
      const hash = MD5(msgboard.eamil);
      const avatar = `https://cravatar.cn/avatar/${hash}?s=100`;
      msgboard.avatar = avatar;
    }
    const { os, browser } = parserResults;
    const { country = '', prov = '', city = '' } = info?.info || {};
    if (prov === '-') {
      msgboard.location = country || '位置';
    } else {
      msgboard.location = prov + '-' + city || '未知';
    }
    msgboard.browser = browser.name + browser.major;
    msgboard.system = os.name + os.version;
    msgboard.ip = ip;
    // uaParser
    const newMsgboard = this.msgboardRepository.create(msgboard);
    await this.msgboardRepository.save(newMsgboard);
    return newMsgboard;
  }

  async findAll(): Promise<Msgboard[]> {
    const sql = this.msgboardRepository.createQueryBuilder('msgboard');
    sql.orderBy('msgboard.createTime', 'DESC');
    const data = await sql.getMany();
    return data.map((v: any) => {
      v.createAt = dayjs(v.createTime).format('YYYY-MM-DD HH:mm:ss');
      return v;
    });
  }
  // 获取IP信息
  async getIPInfo(ip: string) {
    if (!isIPv4(ip)) {
      // 判断是不是ip4
      ip = '';
    }
    // lastValueFrom可以获取到请求到的接口数据
    const checkResultObservable: any = this.httpService
      .get('https://api.vvhan.com/api/getIpInfo?ip=' + ip)
      .pipe(map((res) => res.data));
    const checkResult = await lastValueFrom(checkResultObservable);
    return checkResult;
  }
  async deleteByIds(ids: []) {
    try {
      await this.msgboardRepository.delete(ids);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
