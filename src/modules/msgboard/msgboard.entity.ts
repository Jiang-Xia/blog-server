import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

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
  id: string;

  @ApiProperty({ description: '昵称' })
  @Column()
  name: string;

  @ApiProperty({ description: '邮箱' })
  @Column()
  eamil: string;

  @ApiProperty({ description: '个人主页地址' })
  @Column()
  address: string;

  @ApiProperty({ description: '评论内容' })
  @Column()
  comment: string;

  @ApiProperty({ description: '验证码' })
  @Column()
  code: string;

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
}
