import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { TagService } from './tag.service';
import { Tag } from './tag.entity';

@ApiTags('标签模块')
@Controller('tag')
@UseGuards(RolesGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  /**
   * 添加标签
   * @param tag
   */
  @ApiResponse({ status: 200, description: '创建标签', type: [Tag] })
  @Post()
  @Roles(['admin', 'super'])
  @UseGuards(JwtAuthGuard)
  create(@Body() tag: Tag) {
    return this.tagService.create(tag);
  }

  /**
   * 获取所有标签
   */
  @Get()
  findAll(@Query() query: any): Promise<Tag[]> {
    return this.tagService.findAll(query);
  }

  /**
   * 获取指定标签
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.tagService.findById(id);
  }

  /**
   * 获取指定标签，包含相关文章信息
   * @param id
   */
  @Get(':id/article')
  getArticleById(@Param('id') id: string, @Query('status') status: string) {
    return this.tagService.getArticleById(id, status);
  }

  /**
   * 更新标签
   * @param id
   * @param tag
   */
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id: string, @Body() tag: Tag) {
    return this.tagService.updateById(id, tag);
  }

  /**
   * 删除标签
   * @param id
   */
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id: string) {
    return this.tagService.deleteById(id);
  }
}
