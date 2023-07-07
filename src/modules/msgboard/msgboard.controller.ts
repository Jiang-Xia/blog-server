import {
  Body,
  Controller,
  Request,
  Get,
  Post,
  Query,
  UseGuards,
  Inject,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { MsgboardService } from './msgboard.service';
import { Msgboard } from './msgboard.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IpAddress } from 'src/utils/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { DayMilliseconds } from 'src/utils/constant';
// 文档
@ApiTags('留言板模块')
@Controller('msgboard')
// 权限
@UseGuards(RolesGuard)
export class MsgboardController {
  constructor(
    private readonly msgboardService: MsgboardService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async create(@Body() msgboard: Msgboard, @Request() req: Request, @IpAddress() ip: string) {
    const maxCount = 10;
    const day = DayMilliseconds;
    let count: number = await this.cacheManager.get(ip);
    if (!count) {
      // 一天里首次留言记录次数
      this.cacheManager.set(ip, 1, day);
      return this.msgboardService.create(msgboard, req, ip);
    } else if (count < maxCount) {
      count += 1;
      this.cacheManager.set(ip, count, day);
      return this.msgboardService.create(msgboard, req, ip);
    } else {
      throw new HttpException('一天只能留言10条哦！', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Msgboard[]> {
    return this.msgboardService.findAll();
  }

  @Post('/delete')
  @Roles(['admin', 'super'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Body() ids) {
    // console.log(ids);
    return this.msgboardService.deleteByIds(ids);
  }
}
