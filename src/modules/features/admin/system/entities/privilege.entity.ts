import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseModel } from '@/modules/features/common/common.entiry';
import { Role } from './role.entity';
import { PaginationType } from '@/types';
import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength, IsBoolean } from 'class-validator';

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

  @ApiProperty({ description: '路径模式，如 /api/users/:id' })
  @Column({ length: 500, comment: '路径模式，如 /api/users/:id' })
  pathPattern: string;

  @ApiProperty({ description: 'HTTP方法，*表示全部' })
  @Column({ length: 10, comment: 'HTTP方法，*表示全部' })
  httpMethod: string;

  @ApiProperty({ description: '是否公开接口', example: false })
  @Column({ default: false, comment: '是否公开接口' })
  isPublic: boolean;

  @ApiProperty({ description: '是否需要检查资源所有权', example: false })
  @Column({ default: false, comment: '是否需要检查资源所有权' })
  requireOwnership: boolean;

  @ApiProperty({ description: '描述', required: false })
  @Column({ length: 500, nullable: true, comment: '描述' })
  description: string;

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

  @ApiProperty({
    description: '路径模式，如 /api/users/:id',
    example: '/api/users/:id',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '路径模式必须是字符串' })
  @MaxLength(500, { message: '路径模式不能超过500个字符' })
  pathPattern: string;

  @ApiProperty({
    description: 'HTTP方法，*表示全部',
    example: 'GET',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'HTTP方法必须是字符串' })
  @MaxLength(10, { message: 'HTTP方法不能超过10个字符' })
  httpMethod: string;

  @ApiProperty({
    description: '是否公开接口',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '是否公开接口必须是布尔值' })
  isPublic: boolean;

  @ApiProperty({
    description: '是否需要检查资源所有权',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '是否需要检查资源所有权必须是布尔值' })
  requireOwnership: boolean;

  @ApiProperty({
    description: '描述',
    example: '这是一个权限描述',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(500, { message: '描述不能超过500个字符' })
  description: string;
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

  @ApiProperty({
    description: '路径模式，如 /api/users/:id',
    example: '/api/users/:id',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '路径模式必须是字符串' })
  @MaxLength(500, { message: '路径模式不能超过500个字符' })
  pathPattern: string;

  @ApiProperty({
    description: 'HTTP方法，*表示全部',
    example: 'GET',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'HTTP方法必须是字符串' })
  @MaxLength(10, { message: 'HTTP方法不能超过10个字符' })
  httpMethod: string;

  @ApiProperty({
    description: '是否公开接口',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '是否公开接口必须是布尔值' })
  isPublic: boolean;

  @ApiProperty({
    description: '是否需要检查资源所有权',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: '是否需要检查资源所有权必须是布尔值' })
  requireOwnership: boolean;

  @ApiProperty({
    description: '描述',
    example: '这是一个权限描述',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '描述必须是字符串' })
  @MaxLength(500, { message: '描述不能超过500个字符' })
  description: string;
}