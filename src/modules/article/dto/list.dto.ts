// src/modules/article/dto/list.dto.ts
import { Matches } from 'class-validator';
import { regPositive } from 'src/utils/regex.util';
export class ListDTO {
  // 类属性装饰器
  @Matches(regPositive, { message: 'page 不可小于 0' })
  readonly page?: number;
  @Matches(regPositive, { message: 'pageSize 不可小于 0' })
  readonly pageSize?: number;
}
