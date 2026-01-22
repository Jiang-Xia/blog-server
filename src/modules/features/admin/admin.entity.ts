import { PaginationType } from '@/types';
import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeUpdate,
  BeforeInsert,
  ManyToMany,
} from 'typeorm';
import { Role } from './system/entities/role.entity';

/* admin 菜单表 */
@Entity()
export class Menu {
  @ApiProperty({ description: '自身id' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: '父级id' })
  @Column({ default: '0' })
  pid: string = '0';

  @ApiProperty({ description: '菜单路由路径' })
  @Column()
  path: string;

  @ApiProperty({ description: '菜单英文名' })
  @Column()
  name: string;

  @ApiProperty({ description: '菜单中文名' })
  @Column({ default: '' })
  menuCnName: string = '';

  @ApiProperty({ description: '用于菜单排序' })
  @Column({ default: 1 })
  order: number = 1;

  @ApiProperty({ description: '用于菜单图标' })
  @Column({ default: '' })
  icon: string = '';

  @ApiProperty({ description: '用于菜单本地化' })
  @Column({ default: '' })
  locale: string = '';

  @ApiProperty({ description: '菜单鉴权' })
  @Column({ default: true })
  requiresAuth: boolean = true;

  // 暂时用不上
  @ApiProperty({ description: '菜单路由对应前端组件路径' })
  @Column({ default: '' })
  filePath: string = '';

  // 软删除
  @Column({
    default: false,
  })
  isDelete: boolean;
  @ApiProperty()
  @ManyToMany(() => Role, (role) => role.menus, { cascade: false })
  roles: Array<Role>;

  @BeforeInsert()
  @BeforeUpdate()
  setData() {
    if (!this.pid) {
      this.pid = '0';
    }
  }
}
// 可以建多个表

/* 友链 */
@Entity()
export class Link {
  // 数据库 创建时间
  @CreateDateColumn()
  createTime: Date;

  // 数据库 更新时间
  @UpdateDateColumn()
  updateTime: Date;

  @ApiProperty({ description: '自身id' })
  @PrimaryGeneratedColumn()
  id: string;

  @ApiProperty({ description: '图标链接' })
  @Column()
  icon: string;

  @ApiProperty({ description: '网址' })
  @Column()
  url: string;

  @ApiProperty({ description: '标题' })
  @Column()
  title: string;

  @ApiProperty({ description: '个人签名' })
  @Column()
  desp: string;

  @ApiProperty({ description: '是否已经同意申请' })
  @Column({ default: false })
  agreed: boolean;
}

export interface LinkListVo {
  list: Link[];
  pagination: PaginationType;
}
