import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsArray,
  IsNumber,
  IsInt,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AdminUpdateUserDTO {
  @ApiProperty({
    description: '用户昵称',
    example: '张三',
  })
  @IsNotEmpty({ message: '请输入用户昵称' })
  @IsString({ message: '昵称必须是字符串类型' })
  @MinLength(2, { message: '昵称至少需要2个字符' })
  @MaxLength(50, { message: '昵称不能超过50个字符' })
  nickname: string;

  @ApiProperty({
    description: '角色ID数组',
    example: [1, 2],
    required: false,
  })
  @IsOptional()
  @IsArray({ message: '角色ID必须是数组格式' })
  @IsInt({ each: true, message: '每个角色ID必须是整数' })
  roleIds?: number[];

  @ApiProperty({
    description: '部门ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: '部门ID必须是数字' })
  @IsInt({ message: '部门ID必须是整数' })
  deptId?: number;

  @ApiProperty({
    description: '用户简介',
    example: '这是一个用户简介',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '简介必须是字符串类型' })
  @MaxLength(200, { message: '简介不能超过200个字符' })
  intro?: string;

  @ApiProperty({
    description: '头像地址',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '头像地址必须是字符串类型' })
  avatar?: string;
}
