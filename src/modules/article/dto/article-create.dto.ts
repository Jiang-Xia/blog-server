// src/modules/article/dto/article-create.dto.ts
import { IsNotEmpty } from 'class-validator';
// swagger生成文档时有请求参数
import { ApiProperty } from '@nestjs/swagger';

export class ArticleCreateDTO {
  @ApiProperty({
    description: '文章标题',
    example: '啊！美丽的大海',
  })
  @IsNotEmpty({ message: '请输入文章标题' })
  readonly title: string;

  @ApiProperty({
    description: '文章描述/简介',
    example: '给你讲述美丽的大海',
  })
  @IsNotEmpty({ message: '请输入文章标题' })
  readonly description: string;

  @ApiProperty()
  @IsNotEmpty({ message: '请选择文章分类' })
  readonly category: string;

  @ApiProperty()
  @IsNotEmpty({ message: '请选择文章标签' })
  readonly tags: [];

  @ApiProperty({
    description: '文章描述/简介',
    example: '给你讲述美丽的大海',
  })
  @IsNotEmpty({ message: '请输入文章内容' })
  readonly content: string;
}
