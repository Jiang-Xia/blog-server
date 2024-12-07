import { ApiProperty } from '@nestjs/swagger';
import {
  PrimaryColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as dayjs from 'dayjs';

// 基础字段(必须字段)
export class BaseModel {
  @ApiProperty({ description: '自身id' })
  @PrimaryColumn({ comment: '自身id' })
  id: string;

  @ApiProperty({ description: '创建时间' })
  @CreateDateColumn({ comment: '创建时间' })
  createTime: string;

  @ApiProperty({ description: '更新时间' })
  @UpdateDateColumn({ comment: '更新时间' })
  updateTime: string;

  @BeforeInsert()
  @BeforeUpdate()
  formatDates() {
    this.createTime = dayjs(this.createTime).format('YYYY-MM-DD HH:mm:ss');
    this.updateTime = dayjs(this.updateTime).format('YYYY-MM-DD HH:mm:ss');
  }
}
