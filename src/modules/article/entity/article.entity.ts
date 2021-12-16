// src/modules/article/entity/article.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../../tag/tag.entity';
import { Category } from '../../category/category.entity';
@Entity()
// 类名为数据库表名
export class Article {
  // 主键id
  @PrimaryGeneratedColumn()
  id: number;

  // 创建时间
  @CreateDateColumn()
  createTime: Date;

  // 更新时间
  @UpdateDateColumn()
  updateTime: Date;

  // 软删除
  @Column({
    default: false,
  })
  isDelete: boolean;

  // 更新次数
  @VersionColumn()
  version: number;

  // 文章标题
  @Column('text')
  title: string;

  // 文章分类
  @Column('text')
  category: string;

  @ApiProperty()
  @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
  @JoinTable()
  tags: Array<Tag>;

  @ApiProperty()
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string; // 文章状态

  // 文章描述
  @Column('text')
  description: string;

  // 文章内容
  @Column('text')
  content: string;
}
