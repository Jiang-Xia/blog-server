import { ApiProperty } from '@nestjs/swagger';
import { Menu } from '../../admin.entity';
import { Privilege } from '../entities/privilege.entity';

export class MenuPrivilegeTreeVo {
  @ApiProperty({ description: '菜单ID' })
  id: string;

  @ApiProperty({ description: '父级ID' })
  pid: string;

  @ApiProperty({ description: '菜单路由路径' })
  path: string;

  @ApiProperty({ description: '菜单英文名' })
  name: string;

  @ApiProperty({ description: '菜单中文名' })
  menuCnName: string;

  @ApiProperty({ description: '用于菜单排序' })
  order: number;

  @ApiProperty({ description: '用于菜单图标' })
  icon: string;

  @ApiProperty({ description: '用于菜单本地化' })
  locale: string;

  @ApiProperty({ description: '菜单鉴权' })
  requiresAuth: boolean;

  @ApiProperty({ description: '菜单路由对应前端组件路径' })
  filePath: string;

  @ApiProperty({ description: '标签，用于前端树形选择器' })
  label?: string;

  @ApiProperty({ description: '值，用于前端树形选择器' })
  value?: string;

  @ApiProperty({ description: '节点类型：menu 或 privilege' })
  type?: string;

  @ApiProperty({ description: '子菜单', type: [MenuPrivilegeTreeVo] })
  children?: MenuPrivilegeTreeVo[];

  @ApiProperty({ description: '关联的权限列表', type: [Privilege] })
  privileges?: Privilege[];

  @ApiProperty({ description: '选中的权限ID列表' })
  checkedPrivilegeIds?: string[];
}
