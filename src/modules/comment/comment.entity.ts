import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  articleId: string;

  @ApiProperty({ description: '评论内容' })
  @Column()
  content: string;

  @ApiProperty()
  @Column()
  uid: number;
}
