// src/modules/user/entity/user.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
  OneToMany,
} from 'typeorm';
import { Comment } from '../../comment/comment.entity';

@Entity()
export class User {
  // 主键id
  @PrimaryGeneratedColumn()
  id: number;

  // 创建时间
  @CreateDateColumn()
  createTime: Date;

  // 更新时间
  @UpdateDateColumn()
  updateTime: Date;

  // 软删除
  @Column({
    default: false,
  })
  isDelete: boolean;

  // 更新次数
  @VersionColumn()
  version: number;

  // 用户角色 开发阶段默认为admin

  /**
   * super 可以 admin和author进行角色控制，主要用于用户管理
   * admin 可以修改网站的所有内容，除了管理端的用户管理
   * author 可以增删改查文章，评论，回复。
   */
  @Column('simple-enum', {
    enum: ['super', 'admin', 'author'],
    default: 'author',
  })
  role: string;

  /// 用户状态
  @Column('simple-enum', { enum: ['locked', 'active'], default: 'active' })
  status: string;

  // 昵称
  @Column('text')
  nickname: string;

  // 手机号
  @Column('text')
  mobile: string;

  // 加密后的密码
  @Column('text', { select: false })
  password: string;

  // 加密盐
  @Column('text', { select: false })
  salt: string;
}
