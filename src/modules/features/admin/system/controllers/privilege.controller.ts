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
    const privilegeData = {
      privilegeName: createPrivilegeDto.privilegeName,
      privilegeCode: createPrivilegeDto.privilegeCode,
      privilegePage: createPrivilegeDto.privilegePage,
      isVisible: createPrivilegeDto.isVisible,
    };
    return this.service.create(privilegeData);
  }

  @Get()
  read(@Query() query: any): Promise<PrivilegeListVo> {
    return this.service.read(query);
  }

  @Get(':id')
  queryInfo(@Param('id') id: string): Promise<Privilege> {
    return this.service.queryInfo(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePrivilegeDto: UpdatePrivilegeDTO) {
    const privilegeData = {};
    if (updatePrivilegeDto.privilegeName) {
      privilegeData['privilegeName'] = updatePrivilegeDto.privilegeName;
    }
    if (updatePrivilegeDto.privilegeCode) {
      privilegeData['privilegeCode'] = updatePrivilegeDto.privilegeCode;
    }
    if (updatePrivilegeDto.privilegePage) {
      privilegeData['privilegePage'] = updatePrivilegeDto.privilegePage;
    }
    if (updatePrivilegeDto.isVisible !== undefined) {
      privilegeData['isVisible'] = updatePrivilegeDto.isVisible;
    }
    return this.service.update(id, privilegeData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
