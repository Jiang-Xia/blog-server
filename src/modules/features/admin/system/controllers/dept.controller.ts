import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Dept, DeptListVo, CreateDeptDTO, UpdateDeptDTO } from '../entities/dept.entity';
import { DeptService } from '../services/dept.service';

@ApiTags('部门模块')
@Controller('dept')
export class DeptController {
  constructor(private service: DeptService) {}

  @ApiResponse({ status: 200, description: '创建部门', type: Dept })
  @Post()
  async create(@Body() createDeptDto: CreateDeptDTO) {
    const deptData = {
      deptName: createDeptDto.deptName,
      deptCode: createDeptDto.deptCode,
      parentId: createDeptDto.parentId ?? 0,
      leaderId: createDeptDto.leaderId,
      leaderName: createDeptDto.leaderName,
      orderNum: createDeptDto.orderNum ?? 0,
      status: createDeptDto.status ?? 1,
      remark: createDeptDto.remark,
    };
    return this.service.create(deptData);
  }

  @Get()
  read(@Query() query: any): Promise<DeptListVo> {
    return this.service.read(query);
  }

  @Get('tree')
  queryTree(@Query('id') id?: string): Promise<Dept[]> {
    return this.service.queryTree(id);
  }
  @Get(':id')
  queryInfo(@Param('id') id: number): Promise<Dept> {
    return this.service.queryInfo(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDTO) {
    const deptData = {};
    if (updateDeptDto.deptName) {
      deptData['deptName'] = updateDeptDto.deptName;
    }
    if (updateDeptDto.deptCode) {
      deptData['deptCode'] = updateDeptDto.deptCode;
    }
    if (updateDeptDto.parentId !== undefined) {
      deptData['parentId'] = updateDeptDto.parentId;
    }
    if (updateDeptDto.leaderId) {
      deptData['leaderId'] = updateDeptDto.leaderId;
    }
    if (updateDeptDto.leaderName) {
      deptData['leaderName'] = updateDeptDto.leaderName;
    }
    if (updateDeptDto.orderNum !== undefined) {
      deptData['orderNum'] = updateDeptDto.orderNum;
    }
    if (updateDeptDto.status !== undefined) {
      deptData['status'] = updateDeptDto.status;
    }
    if (updateDeptDto.remark) {
      deptData['remark'] = updateDeptDto.remark;
    }
    return this.service.update(id, deptData);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
