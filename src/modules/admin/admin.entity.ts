import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

/* admin 菜单表 */
@Entity()
export class Menu {
  @ApiProperty({ description: '自身id' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ description: '父级id' })
  @Column()
  pid: string;

  @ApiProperty({ description: '菜单路由路径' })
  @Column()
  path: string;

  @ApiProperty({ description: '菜单路由名' })
  @Column()
  name: string;

  @ApiProperty({ description: '用于菜单排序' })
  @Column({ default: 1 })
  order: number;

  @ApiProperty({ description: '用于菜单图标' })
  @Column({ default: '' })
  icon: string;

  @ApiProperty({ description: '用于菜单本地化' })
  @Column({ default: '' })
  locale: string;

  @ApiProperty({ description: '菜单鉴权' })
  @Column({ default: true })
  requiresAuth: boolean;

  // 暂时用不上
  @ApiProperty({ description: '菜单路由对应前端组件路径' })
  @Column({ default: '' })
  filePath: string;
}
// 可以建多个表