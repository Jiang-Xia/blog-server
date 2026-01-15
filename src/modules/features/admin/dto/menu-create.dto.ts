// src/modules/features/admin/dto/menu-create.dto.ts
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MenuCreateDTO {
  @ApiProperty({
    description: '菜单ID',
    example: 'dashboard',
  })
  @IsNotEmpty({ message: '请输入菜单ID' })
  readonly id: string;

  @ApiProperty({
    description: '父级ID',
    example: '0',
    required: false,
  })
  @IsOptional()
  readonly pid?: string;

  @ApiProperty({
    description: '菜单路由路径',
    example: '/dashboard',
  })
  @IsNotEmpty({ message: '请输入菜单路由路径' })
  readonly path: string;

  @ApiProperty({
    description: '菜单路由名',
    example: 'Dashboard',
  })
  @IsNotEmpty({ message: '请输入菜单路由名' })
  readonly name: string;

  @ApiProperty({
    description: '菜单中文名',
    example: '仪表盘',
  })
  @IsNotEmpty({ message: '请输入菜单中文名' })
  @MaxLength(50, { message: '菜单中文名不能超过50个字符' })
  readonly menuCnName: string;

  @ApiProperty({
    description: '用于菜单排序',
    example: 1,
    required: false,
  })
  @IsOptional()
  readonly order?: number;

  @ApiProperty({
    description: '用于菜单图标',
    example: 'icon-dashboard',
    required: false,
  })
  @IsOptional()
  readonly icon?: string;

  @ApiProperty({
    description: '用于菜单本地化',
    example: 'dashboard',
    required: false,
  })
  @IsOptional()
  readonly locale?: string;

  @ApiProperty({
    description: '菜单鉴权',
    example: true,
    required: false,
  })
  @IsOptional()
  readonly requiresAuth?: boolean;

  @ApiProperty({
    description: '菜单路由对应前端组件路径',
    example: '',
    required: false,
  })
  @IsOptional()
  readonly filePath?: string;

  @ApiProperty({
    description: '是否为超级管理员菜单',
    example: true,
    required: false,
  })
  @IsOptional()
  readonly super?: boolean;

  @ApiProperty({
    description: '是否为管理员菜单',
    example: true,
    required: false,
  })
  @IsOptional()
  readonly admin?: boolean;

  @ApiProperty({
    description: '是否为作者菜单',
    example: false,
    required: false,
  })
  @IsOptional()
  readonly author?: boolean;
}
