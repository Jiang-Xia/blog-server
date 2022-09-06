import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { MsgboardService } from './msgboard.service';
import { Msgboard } from './msgboard.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// 文档
@ApiTags('留言板模块')
@Controller('msgboard')
// 权限
@UseGuards(RolesGuard)
export class MsgboardController {
  constructor(private readonly msgboardService: MsgboardService) {}

  @Post()
  create(@Body() Msgboard) {
    return this.msgboardService.create(Msgboard);
  }

  @Get()
  findAll(@Query() queryParams): Promise<Msgboard[]> {
    return this.msgboardService.findAll(queryParams);
  }

  @Post('/delete')
  @Roles(['admin', 'super'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Body() ids) {
    // console.log(ids);
    return this.msgboardService.deleteByIds(ids);
  }
}
