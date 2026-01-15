import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseModel } from '@/modules/features/common/common.entiry';
import { Role } from './role.entity';
import { PaginationType } from '@/types';
import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';

@Entity({
  name: 'privilege',
  comment: '权限表',
})
export class Privilege extends BaseModel {
  @ApiProperty({ description: '权限名称' })
  @Column({ comment: '权限名称' })
  privilegeName: string;

  @ApiProperty({ description: '权限识别码' })
  @Column({ comment: '权限识别码' })
  privilegeCode: string;

  @ApiProperty({ description: '所属页面(菜单id)' })
  @Column({ comment: '所属页面(菜单id)' })
  privilegePage: string;

  @ApiProperty({ description: '是否可见', example: true })
  @Column({ comment: '是否可见', default: true })
  isVisible: boolean;

  @ApiProperty()
  @ManyToMany(() => Role, (role) => role.privileges, { cascade: false })
  roles: Array<Role>;
}

export interface PrivilegeListVo {
  list: Privilege[];
  pagination: PaginationType;
}

export class CreatePrivilegeDTO {
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
  })
  @IsNotEmpty({ message: '请输入权限名称' })
  @IsString({ message: '权限名称必须是字符串' })
  @MinLength(2, { message: '权限名称至少需要2个字符' })
  @MaxLength(50, { message: '权限名称不能超过50个字符' })
  privilegeName: string;

  @ApiProperty({
    description: '权限识别码',
    example: 'user:manage',
  })
  @IsNotEmpty({ message: '请输入权限识别码' })
  @IsString({ message: '权限识别码必须是字符串' })
  @MinLength(2, { message: '权限识别码至少需要2个字符' })
  @MaxLength(100, { message: '权限识别码不能超过100个字符' })
  privilegeCode: string;

  @ApiProperty({
    description: '所属页面',
    example: 'user/index',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '所属页面必须是字符串' })
  @MaxLength(100, { message: '所属页面不能超过100个字符' })
  privilegePage: string;

  @ApiProperty({
    description: '是否可见',
    example: true,
    required: false,
  })
  @IsOptional()
  isVisible: boolean;
}

export class UpdatePrivilegeDTO {
  @ApiProperty({
    description: '权限名称',
    example: '用户管理',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '权限名称必须是字符串' })
  @MinLength(2, { message: '权限名称至少需要2个字符' })
  @MaxLength(50, { message: '权限名称不能超过50个字符' })
  privilegeName: string;

  @ApiProperty({
    description: '权限识别码',
    example: 'user:manage',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '权限识别码必须是字符串' })
  @MinLength(2, { message: '权限识别码至少需要2个字符' })
  @MaxLength(100, { message: '权限识别码不能超过100个字符' })
  privilegeCode: string;

  @ApiProperty({
    description: '所属页面',
    example: 'user/index',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '所属页面必须是字符串' })
  @MaxLength(100, { message: '所属页面不能超过100个字符' })
  privilegePage: string;

  @ApiProperty({
    description: '是否可见',
    example: true,
    required: false,
  })
  @IsOptional()
  isVisible: boolean;
}
