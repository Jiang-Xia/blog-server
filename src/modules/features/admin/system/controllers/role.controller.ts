import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role, RoleListVo, CreateRoleDTO, UpdateRoleDTO } from '../entities/role.entity';
import { RoleService } from '../services/role.service';
import { MenuPrivilegeTreeVo } from '../vo/menu-privilege-tree.vo';

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(private service: RoleService) {}
  @ApiResponse({ status: 200, description: '获取菜单权限树形数据', type: [MenuPrivilegeTreeVo] })
  @Get('menu-privilege-tree')
  async getMenuPrivilegeTree() {
    return this.service.getMenuPrivilegeTree();
  }

  @ApiResponse({ status: 200, description: '创建角色', type: Role })
  @Post()
  async create(@Body() createRoleDto: CreateRoleDTO) {
    return this.service.create(createRoleDto);
  }

  @Get()
  read(@Query() query: any): Promise<RoleListVo> {
    return this.service.read(query);
  }

  @Get(':id')
  queryInfo(@Param('id') id: string): Promise<Role> {
    return this.service.queryInfo(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDTO) {
    return this.service.update(id, updateRoleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
