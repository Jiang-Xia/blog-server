import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { Msgboard } from './msgboard.entity';
import axios from 'axios';
import { MD5 } from 'crypto-js';

// 后端还是一个个模块分开写比较清晰，集合再一起久了，不清晰功能下载哪里了！
@Injectable()
export class MsgboardService {
  constructor(
    @InjectRepository(Msgboard)
    private readonly msgboardRepository: Repository<Msgboard>,
  ) {}
  async create(Msgboard: Partial<Msgboard>): Promise<Msgboard> {
    console.log('https://v1.alapi.cn/api/avatar', {
      email: Msgboard.eamil,
      size: 100,
    });
    const avatar = `https://v1.alapi.cn/api/avatar?email=${Msgboard.eamil}&size=100`;
    Msgboard.avatar = avatar;
    const newCategory = await this.msgboardRepository.create(Msgboard);
    await this.msgboardRepository.save(newCategory);
    return newCategory;
  }

  async findAll(queryParams): Promise<Msgboard[]> {
    const sql = this.msgboardRepository.createQueryBuilder('msgboard');
    sql.orderBy('msgboard.createTime', 'DESC');
    const data = await sql.getMany();
    return data.map((v: any) => {
      v.createAt = dayjs(v.createTime).format('YYYY-MM-DD HH:mm:ss');
      return v;
    });
  }

  async deleteByIds(ids: []) {
    try {
      await this.msgboardRepository.delete(ids);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
