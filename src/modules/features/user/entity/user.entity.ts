// src/modules/user/entity/user.entity.ts

import { ApiProperty } from '@nestjs/swagger';
import { encryptPassword } from 'src/utils/cryptogram.util';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Article } from '../../article/entity/article.entity';
import { Comment } from '../../comment/comment.entity';
import { Role } from '@/modules/features/admin/system/entities/role.entity';

export enum UserStatus {
  LOCKED = 'locked',
  ACTIVE = 'active',
}

export enum UserRole {
  SUPER = 'super',
  ADMIN = 'admin',
  AUTHOR = 'author',
}

@Entity()
export class User {
  /**
   * @description: 比较密码是否相等
   * @param {string} password0  未加密密码
   * @param {string} dbPassword 已加盐加密的数据库中密码
   * @param {string} salt
   * @return {boolean}
   */
  static compactPass(password0: string, dbPassword: string, salt: string) {
    const currentHashPassword = encryptPassword(password0, salt);
    return dbPassword === currentHashPassword;
  }

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
    enum: UserRole,
    default: UserRole.AUTHOR,
  })
  role: UserRole;

  /// 用户状态
  @Column('simple-enum', { enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  // 昵称
  @Column('varchar')
  @ApiProperty({ description: '昵称', example: '江夏' })
  nickname: string;

  // 用户名
  @Column('varchar', { default: '' })
  @ApiProperty({ description: '用户名', example: 'jiangxia' })
  username?: string;

  @Column('varchar', { default: '' })
  @ApiProperty({ description: '手机号', example: '18666666666' })
  mobile: string;

  // 邮箱
  @Column('varchar', { nullable: true, unique: true })
  @ApiProperty({ description: '邮箱地址', example: 'user@example.com' })
  email?: string;

  // 邮箱
  @Column('varchar', { nullable: true, unique: true })
  @ApiProperty({ description: 'githubId', example: '123456789' })
  githubId?: string;

  // 加密后的密码
  @Column('text', { select: false /* 默认查询不选择的，需要时 andSelect */ })
  password: string;

  // 加密盐
  @Column('text', { select: false })
  salt: string;

  /* 额外资料 */
  @ApiProperty({ description: '简介或者个性签名' })
  @Column('varchar', { default: '' })
  intro?: string;

  @ApiProperty({ description: '头像' })
  @Column('varchar', { default: '' })
  avatar?: string;

  @ApiProperty({ description: '个人主页' })
  @Column('varchar', { default: '' })
  homepage?: string;

  @ApiProperty({ description: '用户文章数/一个用户多个文章' })
  @OneToMany(() => Article, (article) => article.user)
  articles: Array<Article>; // 不能和分类那个名字一样

  @ApiProperty({ description: '用户文章数/一个用户多个文章' })
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Array<Comment>;

  @ApiProperty({ description: '角色' })
  @ManyToMany(() => Role, (role) => role.users, { cascade: false })
  roles: Array<Role>;
}
