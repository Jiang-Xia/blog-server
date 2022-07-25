import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Menu } from './admin.entity';

// 接口继承
interface MenuState extends Menu {
  children: MenuState[];
  meta: metaState;
}

interface metaState {
  order: number;
  icon: string;
  locale: string;
  requiresAuth: boolean;
}

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
  ) {}
  async findAll(): Promise<Menu[]> {
    // const { articleStatus } = queryParams;
    const qb = this.menuRepository
      .createQueryBuilder('menu')
      .orderBy('menu.order', 'ASC');
    const data = await qb.getMany();
    const menuTree = [];
    // 设置一下属性和删属性
    const setMenuTree = (item: any) => {
      const { order, icon, locale, requiresAuth } = item;
      // console.log('item1', item);
      item.meta = {
        order,
        icon,
        locale,
        requiresAuth,
      };
      // console.log('item1', item);

      Object.keys(item.meta).forEach((key) => {
        delete item[key]; // 删除原本层级的属性
      });
    };
    // 组成菜单树
    data.forEach((v: MenuState) => {
      if (v.pid === '0') {
        setMenuTree(v);
        v.children = [];
        data.forEach((v2: MenuState) => {
          if (v.id === v2.pid) {
            setMenuTree(v2);
            v.children.push(v2);
          }
        });
        menuTree.push(v);
      }
    });
    // console.log('所有菜单：', {menuTree});
    return menuTree;
  }
}
