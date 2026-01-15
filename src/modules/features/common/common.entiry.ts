import { ApiProperty } from '@nestjs/swagger';
import {
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import dayjs from 'dayjs';

// 基础字段(必须字段)
export class BaseModel {
  @ApiProperty({ description: '自身id' })
  @PrimaryGeneratedColumn({ comment: '自身id' })
  id: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ comment: '创建时间' })
  @Transform(({ value }) => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'), {
    toPlainOnly: true,
  })
  createTime: Date;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ comment: '更新时间' })
  @Transform(({ value }) => value && dayjs(value).format('YYYY-MM-DD HH:mm:ss'), {
    toPlainOnly: true,
  })
  updateTime: Date;

  @BeforeInsert()
  @BeforeUpdate()
  formatDates() {
    // 这里可以保留用于特殊场景，但通常不需要手动格式化
  }
}
