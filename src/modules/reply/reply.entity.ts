import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: '评论id(父级id)' })
  @Column()
  parentId: string;

  @ApiProperty({ description: '回复目标id' })
  @Column()
  replyUid: string;

  @ApiProperty({ description: '回复内容' })
  @Column()
  content: string;

  @ApiProperty({ description: '回复用户id' })
  @Column()
  uid: number;
}
