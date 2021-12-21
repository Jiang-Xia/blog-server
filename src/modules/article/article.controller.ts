// src/modules/article/article.controller.ts

import {
  Controller,
  Body,
  Query,
  Get,
  Delete,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleCreateDTO } from './dto/article-create.dto';
import { ArticleEditDTO } from './dto/article-edit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ArticleInfoVO, ArticleInfoResponse } from './vo/article-info.vo';
import { ArticleListResponse, ArticleListVO } from './vo/article-list.vo';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';

@ApiTags('文章模块')
@Controller('article')
@UseGuards(RolesGuard)
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiOkResponse({ description: '文章列表', type: ArticleListResponse })
  @Get('list')
  async getMore(@Query() listDTO: ListDTO): Promise<ArticleListVO> {
    return await this.articleService.getMore(listDTO);
  }
  @Get('info')
  @ApiOkResponse({ description: '文章详情', type: ArticleInfoResponse })
  async getOne(@Query() idDto: IdDTO): Promise<ArticleInfoVO> {
    return await this.articleService.getOne(idDto);
  }

  @Post('create')
  // 文档部分添加鉴权(文档调用是不用鉴权)
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '创建文章', type: ArticleInfoResponse })
  async create(
    @Body() articleCreateDTO: ArticleCreateDTO,
  ): Promise<ArticleInfoVO> {
    // console.log(articleCreateDTO, 'articleCreateDTO');
    return await this.articleService.create(articleCreateDTO);
  }

  @Post('edit')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '编辑文章', type: ArticleInfoResponse })
  async update(@Body() articleEditDTO: ArticleEditDTO): Promise<ArticleInfoVO> {
    return await this.articleService.update(articleEditDTO);
  }

  @Delete('delete')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '删除文章', type: ArticleInfoResponse })
  async delete(@Body() idDto: IdDTO): Promise<ArticleInfoVO> {
    return await this.articleService.delete(idDto);
  }
}
