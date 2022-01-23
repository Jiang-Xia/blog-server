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
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../../tag/tag.entity';
import { Category } from '../../category/category.entity';
@Entity()
// 类名为数据库表名
export class Article {
  [x: string]: any;
  // 主键id
  @PrimaryGeneratedColumn()
  id: number;

  // 数据库 创建时间
  @CreateDateColumn({})
  createTime: Date;

  // 数据库 更新时间
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
  // 多对一，多篇文章属于一类
  @ManyToOne(() => Category, (category) => category.articles)
  @JoinColumn({ name: 'articles' })
  category: Category;

  @ApiProperty()
  @ManyToMany(() => Tag, (tag) => tag.articles, { cascade: true })
  @JoinTable()
  tags: Array<Tag>;

  @ApiProperty({ description: '封面图' })
  @Column('varchar', { default: '' })
  cover: string; // 封面图

  @ApiProperty({ description: '喜欢/点赞数' })
  @Column('int', { default: 0 })
  likes: number;

  @ApiProperty({ description: '阅读量' })
  @Column('int', { default: 0 })
  views: number;

  @ApiProperty({ description: '文章状态' })
  @Column('simple-enum', { enum: ['draft', 'publish'] })
  status: string;

  // 文章描述
  @Column('text')
  description: string;

  // 文章内容
  @Column('longtext')
  content: string;

  // 文章html
  @Column('longtext')
  contentHtml?: string;
}
