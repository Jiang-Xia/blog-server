import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from '../article/entity/article.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Article, (article) => article.comments)
  @JoinColumn({ name: 'comments' })
  articleId: Article;

  @ApiProperty({ description: '评论内容' })
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  uid: number;
}
