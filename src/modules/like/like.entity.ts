import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

/* 点赞表 */
@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  articleId: string;

  @ApiProperty()
  @Column()
  uid: number;

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
