import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { MenuService } from './admin.service';
import { Menu } from './admin.entity';
// 文档
@ApiTags('管理台模块')
@Controller('admin')
// 权限
@UseGuards(RolesGuard)
export class MenuController {
  constructor(private readonly adminService: MenuService) {}

  // https://www.cnblogs.com/xiaoyantongxue/p/15758271.html

  @Get('menu')
  findAllMenu(@Body() AdminDTO: Menu) {
    return this.adminService.findAll();
  }
}
