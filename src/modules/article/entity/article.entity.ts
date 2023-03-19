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
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tag } from '../../tag/tag.entity';
import { Category } from '../../category/category.entity';
import { User } from '../../user/entity/user.entity';
import { Comment } from '../../comment/comment.entity';
import { Like } from '../../like/like.entity';

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

  // 文章的更新时间
  @Column('text')
  uTime: Date;

  // 用户id
  @Column()
  uid: number;

  @ManyToOne(() => User, (user) => user.articles)
  /* 
    name和分类表 一样会造成数据错乱，启动建表报错 
    不使用 JoinColumn 会自动生成userId 即 user字段 和id字段组成 这里命名为 useArticles
  */
  @JoinColumn({ name: 'useArticles' })
  user: User;

  @ApiProperty({ description: '一条文章数多个评论' })
  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Array<Comment>;

  @ApiProperty({ description: '一条文章数点赞' })
  @OneToMany(() => Like, (like) => like.article)
  articleLikes: Array<Like>;

  @ApiProperty({ description: '软删除' })
  @Column({
    default: false,
  })
  isDelete: boolean;

  @ApiProperty({ description: '文章置顶' })
  @Column({
    default: false,
  })
  topping: boolean;

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
  @Column('longtext')
  cover: string; // 封面图

  @ApiProperty({ description: '喜欢/点赞数' })
  @Column('int', { default: 0 })
  likes: number;

  @ApiProperty({ description: '阅读量' })
  @Column('int', { default: 0 })
  views: number;

  @ApiProperty({ description: '文章状态' })
  @Column('simple-enum', { enum: ['draft', 'publish'], default: 'publish' })
  status: string;

  // 文章描述
  @Column('text')
  description: string;

  // 文章内容
  @Column('longtext')
  content: string;

  // 文章html
  @Column('longtext')
  contentHtml: string;
}
