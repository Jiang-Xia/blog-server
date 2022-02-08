import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { query } from 'express';
import { ResourcesService } from './resources.service';

// 文档
@ApiTags('资源模块')
@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('daily-img')
  async getImg(@Query() query: any) {
    return await this.resourcesService.getImg(query.n);
  }
}
