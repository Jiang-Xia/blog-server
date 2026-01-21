import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column } from 'typeorm';
import { BaseModel } from '@/modules/features/common/common.entiry';
import { PaginationType } from '@/types';
import { IsString, IsNotEmpty } from 'class-validator';
import { IsOptional, MaxLength, MinLength } from 'class-validator';
import { IsNumber, IsPositive, IsInt } from 'class-validator';

// 部门表
@Entity({
  name: 'dept',
  comment: '部门表',
})
export class Dept extends BaseModel {
  @ApiProperty({ description: '部门名称' })
  @Column({ comment: '部门名称' })
  deptName: string;

  @ApiProperty({ description: '部门编码' })
  @Column({ comment: '部门编码', unique: true })
  deptCode: string;

  @ApiProperty({ description: '父级部门ID，顶级部门为0' })
  @Column({ comment: '父级部门ID', default: 0 })
  parentId: number;

  @ApiProperty({ description: '部门负责人ID' })
  @Column({ comment: '部门负责人ID', nullable: true })
  leaderId: string;

  @ApiProperty({ description: '部门负责人姓名', required: false })
  @Column({ comment: '部门负责人姓名', nullable: true })
  leaderName: string;

  @ApiProperty({ description: '部门排序' })
  @Column({ comment: '部门排序', default: 0 })
  orderNum: number;

  @ApiProperty({ description: '部门状态', default: 1 })
  @Column({ comment: '部门状态', default: 1 }) // 1-正常 0-禁用
  status: number;

  @ApiProperty({ description: '部门描述', required: false })
  @Column({ comment: '部门描述', nullable: true })
  remark: string;

  // 用于树形结构展示
  children?: Dept[];
}

export interface DeptListVo {
  list: Dept[];
  pagination: PaginationType;
}

export class CreateDeptDTO {
  @ApiProperty({
    description: '部门名称',
    example: '技术部',
  })
  @IsNotEmpty({ message: '请输入部门名称' })
  @IsString({ message: '部门名称必须是字符串' })
  @MinLength(2, { message: '部门名称至少需要2个字符' })
  @MaxLength(50, { message: '部门名称不能超过50个字符' })
  deptName: string;

  @ApiProperty({
    description: '部门编码',
    example: 'tech',
  })
  @IsNotEmpty({ message: '请输入部门编码' })
  @IsString({ message: '部门编码必须是字符串' })
  @MinLength(2, { message: '部门编码至少需要2个字符' })
  @MaxLength(50, { message: '部门编码不能超过50个字符' })
  deptCode: string;

  @ApiProperty({
    description: '父级部门ID',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '父级部门ID必须是数字' })
  @IsInt({ message: '父级部门ID必须是整数' })
  parentId?: number = 0;

  @ApiProperty({
    description: '部门负责人ID',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门负责人ID必须是字符串' })
  @MaxLength(50, { message: '部门负责人ID不能超过50个字符' })
  leaderId?: string;

  @ApiProperty({
    description: '部门负责人姓名',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门负责人姓名必须是字符串' })
  @MaxLength(50, { message: '部门负责人姓名不能超过50个字符' })
  leaderName?: string;

  @ApiProperty({
    description: '部门排序',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '部门排序必须是数字' })
  @IsInt({ message: '部门排序必须是整数' })
  orderNum?: number = 0;

  @ApiProperty({
    description: '部门状态',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '部门状态必须是数字' })
  @IsInt({ message: '部门状态必须是整数' })
  status?: number = 1;

  @ApiProperty({
    description: '部门描述',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门描述必须是字符串' })
  @MaxLength(200, { message: '部门描述不能超过200个字符' })
  remark?: string;
}

export class UpdateDeptDTO {
  @ApiProperty({
    description: '部门名称',
    example: '技术部',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门名称必须是字符串' })
  @MinLength(2, { message: '部门名称至少需要2个字符' })
  @MaxLength(50, { message: '部门名称不能超过50个字符' })
  deptName?: string;

  @ApiProperty({
    description: '部门编码',
    example: 'tech',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门编码必须是字符串' })
  @MinLength(2, { message: '部门编码至少需要2个字符' })
  @MaxLength(50, { message: '部门编码不能超过50个字符' })
  deptCode?: string;

  @ApiProperty({
    description: '父级部门ID',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '父级部门ID必须是数字' })
  @IsInt({ message: '父级部门ID必须是整数' })
  @IsPositive({ message: '父级部门ID必须是正数或0' })
  parentId?: number;

  @ApiProperty({
    description: '部门负责人ID',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门负责人ID必须是字符串' })
  @MaxLength(50, { message: '部门负责人ID不能超过50个字符' })
  leaderId?: string;

  @ApiProperty({
    description: '部门负责人姓名',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门负责人姓名必须是字符串' })
  @MaxLength(50, { message: '部门负责人姓名不能超过50个字符' })
  leaderName?: string;

  @ApiProperty({
    description: '部门排序',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '部门排序必须是数字' })
  @IsInt({ message: '部门排序必须是整数' })
  orderNum?: number;

  @ApiProperty({
    description: '部门状态',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '部门状态必须是数字' })
  @IsInt({ message: '部门状态必须是整数' })
  status?: number;

  @ApiProperty({
    description: '部门描述',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '部门描述必须是字符串' })
  @MaxLength(200, { message: '部门描述不能超过200个字符' })
  remark?: string;
}
