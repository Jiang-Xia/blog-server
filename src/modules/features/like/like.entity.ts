import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Article } from '../article/entity/article.entity';

/* 点赞表 */
@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  articleId: number;

  @ApiProperty()
  @Column({ default: -999 }) // 默认-999为游客点赞,登录时可以传uid
  uid?: number;

  @ApiProperty()
  @Column({ default: '' })
  ip: string;

  @ManyToOne(() => Article, (article) => article.articleLikes)
  article: Article;

  @ApiProperty()
  @Column({
    type: 'enum',
    enum: [1, 0], // 1为点赞 0 取消点赞
  })
  status: number;
}

/* 收藏表 */
@Entity()
export class Collect {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '收藏文章id' })
  @Column()
  articleId: string;

  @ApiProperty({ description: '收藏用户id' })
  @Column()
  uid: number;
}
