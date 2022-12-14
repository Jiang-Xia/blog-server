// src/modules/article/vo/article-list.vo.ts

import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../../tag/tag.entity';
import { Category } from '../../category/category.entity';
import { Article } from '../entity/article.entity';

// class SimpleInfo {
//   @ApiProperty({ description: '文章id', example: 1 })
//   id: number;

//   @ApiProperty({ description: '创建时间', example: '2021-07-03' })
//   createTime: Date;

//   @ApiProperty({ description: '更新时间', example: '2021-07-03' })
//   updateTime: Date;

//   @ApiProperty({ description: '文章标题', example: '文章标题' })
//   title: string;

//   @ApiProperty({ description: '文章描述', example: '文章描述' })
//   description: string;

//   @ApiProperty({ description: '文章分类', example: '文章分类' })
//   category: Category;

//   @ApiProperty({ description: '文章标签', example: '文章标签' })
//   tags: Array<Tag>;
// }

class Pagination {
  @ApiProperty({ description: '第几页', example: 1 })
  page: number;

  @ApiProperty({ description: '每页条数', example: 10 })
  pageSize: number;

  @ApiProperty({ description: '总页数', example: 10 })
  pages: number;

  @ApiProperty({ description: '总条数', example: 100 })
  total: number;
}

export class ArticleListVO {
  @ApiProperty({ type: Article, isArray: true })
  list: Array<Article>;

  // @ApiProperty({ type: () => Pagination })
  // pagination: Pagination;
}

export class ArticleListResponse {
  @ApiProperty({ description: '状态码', example: 200 })
  code: number;

  @ApiProperty({
    description: '数据',
    type: () => ArticleListVO,
    example: ArticleListVO,
  })
  data: ArticleListVO;

  @ApiProperty({ description: '请求结果信息', example: '请求成功' })
  message: string;
}
