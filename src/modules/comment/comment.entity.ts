import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/entity/user.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '文章id' })
  @Column()
  articleId: number;

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
