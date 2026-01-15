import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { BaseModel } from '@/modules/features/common/common.entiry';
import { Privilege } from './privilege.entity';
import { User } from '@/modules/features/user/entity/user.entity';
import { Menu } from '@/modules/features/admin/admin.entity';
import { PaginationType } from '@/types';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { IsString, IsArray, IsOptional, MaxLength, MinLength } from 'class-validator';

// 角色表
@Entity({
  name: 'role',
  comment: '角色表',
})
export class Role extends BaseModel {
  @ApiProperty({ description: '角色名' })
  @Column({ comment: '角色名' })
  roleName: string;

  @ApiProperty({ description: '角色描述' })
  @Column({ comment: '角色描述' })
  roleDesc: string;

  @ApiProperty()
  @ManyToMany(() => Privilege, (privilege) => privilege.roles, { cascade: false })
  @JoinTable()
  privileges: Array<Privilege>;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.roles, { cascade: false })
  @JoinTable()
  users: Array<User>;

  @ApiProperty()
  @ManyToMany(() => Menu, (menu) => menu.roles, { cascade: false })
  @JoinTable()
  menus: Array<Menu>;
}

export interface RoleListVo {
  list: Role[];
  pagination: PaginationType;
}

export class CreateRoleDTO {
  @ApiProperty({
    description: '角色名',
    example: 'admin',
  })
  @IsNotEmpty({ message: '请输入角色名' })
  @IsString({ message: '角色名必须是字符串' })
  @MinLength(2, { message: '角色名至少需要2个字符' })
  @MaxLength(50, { message: '角色名不能超过50个字符' })
  roleName: string;

  @ApiProperty({
    description: '角色描述',
    example: '管理员角色',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '角色描述必须是字符串' })
  @MaxLength(200, { message: '角色描述不能超过200个字符' })
  roleDesc?: string;

  @ApiProperty({
    description: '权限ID数组',
    example: ['priv1', 'priv2'],
  })
  @IsNotEmpty({ message: '请输入角色权限' })
  @IsArray({ message: '权限必须是数组格式' })
  privileges: string[];

  @ApiProperty({
    description: '菜单ID数组',
    example: ['menu1', 'menu2'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: '菜单必须是数组格式' })
  menus: string[];
}

export class UpdateRoleDTO {
  @ApiProperty({
    description: '角色名',
    example: 'admin',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '角色名必须是字符串' })
  @MinLength(2, { message: '角色名至少需要2个字符' })
  @MaxLength(50, { message: '角色名不能超过50个字符' })
  roleName?: string;

  @ApiProperty({
    description: '角色描述',
    example: '管理员角色',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '角色描述必须是字符串' })
  @MaxLength(200, { message: '角色描述不能超过200个字符' })
  roleDesc?: string;

  @ApiProperty({
    description: '权限ID数组',
    example: ['priv1', 'priv2'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: '权限必须是数组格式' })
  privileges: string[];

  @ApiProperty({
    description: '菜单ID数组',
    example: ['menu1', 'menu2'],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: '菜单必须是数组格式' })
  menus: string[];
}
