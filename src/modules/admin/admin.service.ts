import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link, Menu } from './admin.entity';

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

  async create(Menu: Partial<Menu>): Promise<Menu> {
    const { id } = Menu;
    const exist = await this.menuRepository.findOne({
      where: { id },
    });

    if (exist) {
      throw new HttpException('菜单已存在', HttpStatus.BAD_REQUEST);
    }
    const newItem = await this.menuRepository.create(Menu);
    await this.menuRepository.save(newItem);
    return newItem;
  }

  async updateById(id, item: Partial<Menu>): Promise<Menu> {
    const oldItem = await this.menuRepository.findOne(id);
    const updatedItem = await this.menuRepository.merge(oldItem, item);
    return this.menuRepository.save(updatedItem);
  }

  async deleteById(id) {
    try {
      const menu = await this.menuRepository.findOne(id);
      await this.menuRepository.remove(menu);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}

// 外链
@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(Link)
    private readonly linkRepository: Repository<Link>,
  ) {}

  async create(Link: Partial<Link>): Promise<Link> {
    const { url } = Link;
    const existCategory = await this.linkRepository.findOne({
      where: { url },
    });

    if (existCategory) {
      throw new HttpException('外链已存在', HttpStatus.BAD_REQUEST);
    }
    const newCategory = await this.linkRepository.create(Link);
    await this.linkRepository.save(newCategory);
    return newCategory;
  }

  async findAll(queryParams): Promise<Link[]> {
    // const { articleStatus } = queryParams;
    const qb = this.linkRepository
      .createQueryBuilder('link')
      .orderBy('link.createTime', 'ASC');
    const data = await qb.getMany();
    return data;
    // return this.linkRepository.find({ order: { createAt: 'ASC' } });
  }

  async updateById(id, item: Partial<Link>): Promise<Link> {
    const oldItem = await this.linkRepository.findOne(id);
    const updatedItem = await this.linkRepository.merge(oldItem, item);
    return this.linkRepository.save(updatedItem);
  }

  async deleteById(id) {
    try {
      const link = await this.linkRepository.findOne(id);
      await this.linkRepository.remove(link);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
