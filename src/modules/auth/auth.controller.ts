import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Role } from './entities/role.entity';
import { Privilege } from './entities/privilege.entity';
import { PrivilegeService, RoleService } from './auth.service';

@ApiTags('角色模块')
@Controller('role')
export class RoleController {
  constructor(private service: RoleService) {}

  @ApiResponse({ status: 200, description: '创建角色', type: [Role] })
  @Post()
  create(@Body() role: Role) {
    return this.service.create(role);
  }

  @Get()
  read(@Query() query: any): Promise<Role[]> {
    return this.service.read(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() role: Role) {
    return this.service.update(id, role);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}

@ApiTags('权限模块')
@Controller('privilege')
export class PrivilegeController {
  constructor(private service: PrivilegeService) {}

  @ApiResponse({ status: 200, description: '创建权限', type: [Privilege] })
  @Post()
  create(@Body() role: Privilege) {
    return this.service.create(role);
  }

  @Get()
  read(@Query() query: any): Promise<Privilege[]> {
    return this.service.read(query);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() role: Privilege) {
    return this.service.update(id, role);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
