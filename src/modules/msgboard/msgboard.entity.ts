import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
/* 留言板表 */
@Entity()
export class Msgboard {
  // 数据库 创建时间
  @CreateDateColumn()
  createTime: Date;

  // 数据库 更新时间
  @UpdateDateColumn()
  updateTime: Date;

  @ApiProperty({ description: '自身id' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: '昵称' })
  @Column()
  name: string;

  @ApiProperty({ description: '邮箱' })
  @Column()
  // @IsEmail()
  eamil: string;

  @ApiProperty({ description: '个人主页地址' })
  @Column()
  address: string;

  @ApiProperty({ description: '评论内容' })
  @Column()
  @IsNotEmpty()
  comment: string;

  @ApiProperty({ description: '头像' })
  @Column()
  avatar: string;

  @ApiProperty({ description: '位置' })
  @Column()
  location: string;

  @ApiProperty({ description: '系统' })
  @Column()
  system: string;

  @ApiProperty({ description: '浏览器版本' })
  @Column()
  browser: string;

  @ApiProperty({ description: '父级id 0为一级评论' })
  @Column({ default: 0 })
  pId: number;

  @ApiProperty({ description: '回复的评论的id' })
  @Column({ default: null })
  replyId: number;

  @ApiProperty({ description: '回复人名称' })
  @Column({ default: null })
  respondent: string;

  @ApiProperty({ description: '图片地址' })
  @Column({ default: null })
  imgUrl: string;

  @ApiProperty({ description: 'ip地址' })
  @Column({ default: null })
  ip: string;
}
