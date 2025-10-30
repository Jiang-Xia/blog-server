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
import { JwtAuthGuard } from '../../security/auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../security/auth/roles.guard';
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@ApiTags('分类模块')
@Controller('category')
@UseGuards(RolesGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 添加分类
   * @param category
   */
  @ApiResponse({ status: 200, description: '添加分类', type: [Category] })
  @Post()
  @Roles(['admin', 'super'])
  @UseGuards(JwtAuthGuard)
  create(@Body() category: Category) {
    return this.categoryService.create(category);
  }

  /**
   * 获取所有分类
   */
  @Get()
  findAll(@Query() query: any): Promise<Category[]> {
    return this.categoryService.findAll(query);
  }

  /**
   * 获取指定分类
   * @param id
   */
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  /**
   * 更新分类
   * @param id
   * @param category
   */
  @Patch(':id')
  @Roles(['admin', 'super'])
  @UseGuards(JwtAuthGuard)
  updateById(@Param('id') id: string, @Body() category: Category) {
    return this.categoryService.updateById(id, category);
  }

  /**
   * 删除分类
   * @param id
   */
  @Delete(':id')
  @Roles(['admin', 'super'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id: string) {
    return this.categoryService.deleteById(id);
  }
}
