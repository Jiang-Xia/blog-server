import { Body, Controller, Request, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MsgboardService } from './msgboard.service';
import { Msgboard } from './msgboard.entity';
import { JwtAuthGuard } from '../../security/auth/jwt-auth.guard';
import { IpAddress } from 'src/utils/common';
// 文档
@ApiTags('留言板模块')
@Controller('msgboard')
// 权限
export class MsgboardController {
  constructor(private readonly msgboardService: MsgboardService) {}

  @Post()
  async create(@Body() msgboard: Msgboard, @Request() req: Request, @IpAddress() ip: string) {
    await this.msgboardService.assertMessageAllowed(msgboard.comment, ip);
    return this.msgboardService.create(msgboard, req, ip);
  }

  @Get()
  async findAll(@Query() query: any) {
    return this.msgboardService.findAll(query);
  }

  @Post('/delete')
  @UseGuards(JwtAuthGuard)
  deleteById(@Body() ids: string[]) {
    // console.log(ids);
    return this.msgboardService.deleteByIds(ids);
  }
}
