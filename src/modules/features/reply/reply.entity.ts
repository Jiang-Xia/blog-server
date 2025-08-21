import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // 数据库 创建时间
  @CreateDateColumn()
  createTime: Date;

  // 数据库 更新时间
  @UpdateDateColumn()
  updateTime: Date;

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
