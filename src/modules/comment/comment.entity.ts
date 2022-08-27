import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user/entity/user.entity';
import { Article } from '../article/entity/article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // 数据库 创建时间
  @CreateDateColumn({})
  createTime: Date;

  // 数据库 更新时间
  @UpdateDateColumn()
  updateTime: Date;

  @ManyToOne(() => User, (user) => user.comments)
  // @JoinColumn({ name: 'userId' })
  user: number;

  @ApiProperty({ description: '文章id' })
  @ManyToOne(() => Article, (article) => article.comments)
  // @JoinColumn({ name: 'articleId' })
  article: number;

  @ApiProperty({ description: '评论内容' })
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  uid: number;

  // 会自动生成外键 userId字段（user + User表的id）comment表从表，user为主表
  // @ManyToOne(() => User, (user) => user.comments)
  // user: User;
}
