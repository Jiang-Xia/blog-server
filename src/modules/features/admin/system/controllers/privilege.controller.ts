import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Privilege, PrivilegeListVo } from '../entities/privilege.entity';
import { CreatePrivilegeDTO, UpdatePrivilegeDTO } from '../entities/privilege.entity';
import { PrivilegeService } from '../services/privilege.service';

@ApiTags('权限模块')
@Controller('privilege')
export class PrivilegeController {
  constructor(private service: PrivilegeService) {}

  @ApiResponse({ status: 200, description: '创建权限', type: Privilege })
  @Post()
  async create(@Body() createPrivilegeDto: CreatePrivilegeDTO) {
    return this.service.create(createPrivilegeDto);
  }

  @Get()
  read(@Query() query: any): Promise<PrivilegeListVo> {
    return this.service.read(query);
  }

  @Get(':id')
  queryInfo(@Param('id') id: number): Promise<Privilege> {
    return this.service.queryInfo(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePrivilegeDto: UpdatePrivilegeDTO) {
    return this.service.update(id, updatePrivilegeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
