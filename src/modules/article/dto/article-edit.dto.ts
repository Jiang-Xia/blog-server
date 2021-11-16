// src/modules/article/dto/article-edit.dto.ts

import { IsNotEmpty, Matches } from 'class-validator';
import { regPositive } from 'src/utils/regex.util';
import { ArticleCreateDTO } from './article-create.dto';

export class ArticleEditDTO extends ArticleCreateDTO {
  @Matches(regPositive, { message: '请输入有效 id' })
  @IsNotEmpty({ message: 'id 不能为空' })
  readonly id: number;
}
