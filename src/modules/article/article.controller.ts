import { Controller, Body, Query, Get, Post } from '@nestjs/common';
import { ArticleService } from './article.service';
import { ArticleCreateDTO } from './dto/article-create.dto';
import { ArticleEditDTO } from './dto/article-edit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { ArticleInfoVO, ArticleInfoResponse } from './vo/article-info.vo';
import { ArticleListResponse, ArticleListVO } from './vo/article-list.vo';

@ApiTags('文章模块')
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get('list')
  @ApiOkResponse({ description: '文章列表', type: ArticleListResponse })
  getMore(@Query() listDTO: ListDTO) {
    return this.articleService.getMore(listDTO);
  }

  @Get('info')
  @ApiOkResponse({ description: '文章详情', type: ArticleInfoResponse })
  getOne(@Query() idDto: IdDTO) {
    return this.articleService.getOne(idDto);
  }

  @Post('create')
  @ApiOkResponse({ description: '创建文章', type: ArticleInfoResponse })
  create(@Body() articleCreateDTO: ArticleCreateDTO) {
    return this.articleService.create(articleCreateDTO);
  }

  @Post('edit')
  @ApiOkResponse({ description: '创建文章', type: ArticleInfoResponse })
  update(@Body() articleEditDTO: ArticleEditDTO) {
    return this.articleService.update(articleEditDTO);
  }

  @Post('delete')
  @ApiOkResponse({ description: '删除文章', type: ArticleInfoResponse })
  delete(@Body() idDto: IdDTO) {
    return this.articleService.delete(idDto);
  }
}
