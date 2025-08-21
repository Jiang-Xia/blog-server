// src/modules/article/dto/list.dto.ts
import { IsOptional, Matches } from 'class-validator';
import { regPositive } from 'src/utils/regex.util';
import { ApiProperty } from '@nestjs/swagger';

export class ListDTO {
  @ApiProperty({
    description: '第几页',
    example: 1,
    required: false,
  })
  // @IsOptional()
  // @Matches(regPositive, { message: 'page 不可小于 0' })
  readonly page?: number;

  @ApiProperty({
    description: '每页数据条数',
    example: 10,
    required: false,
  })
  readonly pageSize?: number;
  @ApiProperty({ description: '文章分类' })
  readonly category?: string;
  @ApiProperty({ description: '文章标题' })
  readonly title?: string;
  @ApiProperty({ description: '文章Md内容' })
  readonly content?: string;
  @ApiProperty({ description: '文章描述' })
  description?: string;
  @ApiProperty({ description: '时间排序' })
  sort?: string;
  @ApiProperty({ description: '标签' })
  readonly tags?: string[];

  @ApiProperty({ description: 'home端' })
  readonly client?: boolean;

  @ApiProperty({ description: 'admin端' })
  readonly admin?: boolean;

  @ApiProperty({
    description: '是否只返回自身账号的文章',
  })
  readonly onlyMy?: boolean;
}
