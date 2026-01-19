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
import { Roles, RolesGuard } from '../../security/auth/roles.guard';
import { MenuService, LinkService } from './admin.service';
import { Menu, Link } from './admin.entity';
import { JwtAuthGuard } from '../../security/auth/jwt-auth.guard';
import { MenuCreateDTO } from './dto/menu-create.dto';
import { MenuUpdateDTO } from './dto/menu-update.dto';
// 文档
@ApiTags('管理台菜单模块')
@Controller('admin')
@UseGuards(RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // https://www.cnblogs.com/xiaoyantongxue/p/15758271.html

  @Get('menu')
  findAll(@Query('role') role: string) {
    return this.menuService.findAll(role);
  }

  @Post('menu')
  create(@Body() menu: MenuCreateDTO) {
    // console.log({ menu });
    return this.menuService.create(menu);
  }

  @Patch('menu')
  updateById(@Body() menu: MenuUpdateDTO) {
    return this.menuService.updateField(menu);
  }

  @Get('menu/detail')
  findById(@Query('id') id: string) {
    // console.log({ id });
    return this.menuService.findById(id);
  }

  @Delete('menu')
  @Roles(['super'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Query('id') id: string) {
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
  create(@Body() link: Link) {
    return this.linkService.create(link);
  }
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Link> {
    return this.linkService.findOne(id);
  }

  @Get()
  findAll(@Query('client') client: string): Promise<Link[]> {
    return this.linkService.findAll({ client });
  }

  @Patch(':id')
  updateById(@Param('id') id: string, @Body() link: Link) {
    return this.linkService.updateById(id, link);
  }

  @Delete()
  @Roles(['super'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Query('id') id: string) {
    return this.linkService.deleteById(id);
  }
}
