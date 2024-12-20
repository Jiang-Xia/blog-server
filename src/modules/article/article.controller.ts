// src/modules/article/article.controller.ts

import {
  Controller,
  Body,
  Query,
  Get,
  Delete,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Param,
  Headers,
  Patch,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleCreateDTO } from './dto/article-create.dto';
import { ArticleEditDTO } from './dto/article-edit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { ApiTags, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ArticleInfoVO, ArticleDeleteVO, ArticleInfoResponse } from './vo/article-info.vo';
import { ArticleListResponse, ArticleListVO } from './vo/article-list.vo';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { Article } from './entity/article.entity';
import { getUserInfo, getUid } from 'src/utils';
import { IpAddress } from 'src/utils/common';
import { ApiBody } from '@nestjs/swagger';
// import { XMLParser, XMLValidator } from 'fast-xml-parser';

@ApiTags('文章模块')
@Controller('article')
@UseGuards(RolesGuard)
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @ApiOkResponse({ description: '文章列表', type: ArticleListResponse })
  @ApiBody({ type: ListDTO })
  @Post('list')
  async getMore(
    @Body() listDTO: any,
    @Headers() headers,
    @IpAddress() ip: string,
  ): Promise<ArticleListVO> {
    // console.log('listDTO', listDTO);

    // 解析xml传输数据格式
    // const parser = new XMLParser();
    // console.log('xml', parser.parse(listDTO));
    const info = getUserInfo(headers.authorization);
    return await this.articleService.getMore(listDTO, info);
  }
  @Get('info')
  @ApiOkResponse({ description: '文章详情', type: ArticleInfoResponse })
  async getOne(@Query() idDto: IdDTO): Promise<ArticleInfoVO> {
    return await this.articleService.findById(idDto);
  }

  @Post('create')
  // 文档部分添加鉴权(文档调用是不用鉴权)
  // 只要登陆了都可以增删改查
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '创建文章', type: ArticleInfoResponse })
  async create(
    @Body() articleCreateDTO: ArticleCreateDTO /* 参数 */,
    @Headers() headers,
  ): Promise<Article> /* 返回值 */ {
    // console.log(articleCreateDTO, 'articleCreateDTO');
    return await this.articleService.create(articleCreateDTO, getUid(headers.authorization));
  }

  @Post('edit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '编辑文章', type: ArticleInfoResponse })
  async update(@Body() articleEditDTO: ArticleEditDTO): Promise<ArticleInfoVO> {
    // console.log('articleEditDTO', articleEditDTO);
    return await this.articleService.update(articleEditDTO);
  }

  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '删除文章', type: ArticleInfoResponse })
  async delete(@Query() idDto: IdDTO, @Headers() headers): Promise<ArticleDeleteVO> {
    idDto.uid = getUid(headers.authorization);
    return await this.articleService.delete(idDto);
  }

  /**
   * 文章访问量 +1
   */
  @Post('views')
  @HttpCode(HttpStatus.OK)
  updateViewsById(@Body('id') id: string) {
    return this.articleService.updateViewsById(id);
  }

  /**
   * 文章访喜欢量 +1
   */
  @Post('likes')
  @HttpCode(HttpStatus.OK)
  updateLikesById(@Body('articleId') articleId: string, @Body('status') status: number) {
    return this.articleService.updateLikesById(articleId, status);
  }

  /**
   *  禁用
   */
  @Patch('disabled')
  @HttpCode(HttpStatus.OK)
  updateArticleIsDelete(@Body() field: any) {
    console.log(field, 'updateArticleField===>请选择文章分类');
    return this.articleService.updateArticleField(field);
  }

  /**
   * 置顶
   */
  @Patch('topping')
  @HttpCode(HttpStatus.OK)
  updateArticleTopping(@Body() field: any) {
    return this.articleService.updateArticleField(field);
  }
  /**
   * 获取所有文章归档
   */
  @Get('archives')
  @HttpCode(HttpStatus.OK)
  getArchives(): Promise<any[]> {
    return this.articleService.getArchives();
  }

  /**
   * 文章统计
   */
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  getStatistics(): Promise<object> {
    return this.articleService.getStatistics();
  }
}
