// src/modules/article/dto/article-edit.dto.ts

import { IsNotEmpty, IsOptional, Matches } from 'class-validator';
import { IdDTO } from './id.dto';
import { ApiProperty } from '@nestjs/swagger';
import { regPositive } from 'src/utils/regex.util';
import { Category } from 'src/modules/category/category.entity';
import { Tag } from 'src/modules/tag/tag.entity';

export class ArticleEditDTO {
  @ApiProperty({
    description: '文章标题',
    example: '啊！美丽的大海',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: '请输入文章标题' })
  readonly title?: string;

  @ApiProperty({
    description: '文章描述/简介',
    example: '给你讲述美丽的大海',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: '请输入文章描述' })
  readonly description?: string;

  @ApiProperty()
  @IsNotEmpty({ message: '请选择文章分类' })
  readonly category: Category;

  @ApiProperty()
  @IsNotEmpty({ message: '请选择文章标签' })
  readonly tags: Array<Tag>;

  @ApiProperty({
    description: '文章内容',
    example: '啊！美丽的大海，你是如此美丽',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: '请输入文章内容' })
  readonly content: string;

  @IsNotEmpty({ message: '文章html内容不能为空' })
  readonly contentHtml: string;

  // regPositive 这个正则校验有问题
  // @Matches(regPositive, { message: () => '请输入有效 id' })
  @IsNotEmpty({ message: 'id 不能为空' })
  // 文章id
  id: number;

  @IsNotEmpty({ message: '封面 不能为空' })
  // 文章封面
  cover: string;

  @ApiProperty({
    description: '禁用或者启用',
    example: 'false/true',
    required: false,
  })
  isDelete?: false;
}
