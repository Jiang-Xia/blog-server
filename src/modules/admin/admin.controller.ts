import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { MenuService, LinkService } from './admin.service';
import { Menu, Link } from './admin.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
// 文档
@ApiTags('管理台菜单模块')
@Controller('admin')
@UseGuards(RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // https://www.cnblogs.com/xiaoyantongxue/p/15758271.html

  @Get('menu')
  findAllMenu(@Body() MenuDTO: Menu) {
    return this.menuService.findAll();
  }

  @Post('menu')
  create(@Body() Link) {
    return this.menuService.create(Link);
  }

  @Patch('menu:id')
  updateById(@Param('id') id, @Body() Link) {
    return this.menuService.updateById(id, Link);
  }

  @Delete('menu:id')
  @Roles(['super'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.menuService.deleteById(id);
  }
}

@ApiTags('外链模块')
@Controller('link')
@UseGuards(RolesGuard)
// 外链
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

  @ApiResponse({ status: 200, description: '添加分类', type: [Link] })
  @Post()
  create(@Body() Link) {
    return this.linkService.create(Link);
  }

  @Get()
  findAll(@Query() queryParams): Promise<Link[]> {
    return this.linkService.findAll(queryParams);
  }

  @Patch()
  updateById(@Body() Link) {
    return this.linkService.updateById(Link.id, Link);
  }

  @Delete(':id')
  @Roles(['admin', 'super'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.linkService.deleteById(id);
  }
}
