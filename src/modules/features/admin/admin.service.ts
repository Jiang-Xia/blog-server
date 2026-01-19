import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link, Menu } from './admin.entity';
import MenuList = require('./menu.json');

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
  ) {
    /* 初始化菜单列表 需要捕获错误防止已存在*/
    MenuList.forEach(async (v: Menu, index: number) => {
      await this.create(v)
        .then(() => {
          if (MenuList.length === index + 1) {
            console.log(`默认菜单创建成功，`);
          }
        })
        .catch(() => {
          // if (MenuList.length === index + 1) {
          //   console.log(`默认菜单已经存在`);
          // }
        });
    });
  }
  async findAll(role: string): Promise<Menu[]> {
    // const { articleStatus } = queryParams;
    const qb = this.menuRepository.createQueryBuilder('menu');

    // 作者权限只返回文章管理
    if (role === 'author') {
      qb.andWhere('menu.author=:author', { author: true });
    } else if (role === 'admin') {
      // 不返回用户设置
      qb.andWhere('menu.admin=:admin', { admin: true });
    } else {
      qb.andWhere('menu.super=:super', { super: true });
    }
    qb.orderBy('menu.order', 'ASC');
    const data = await qb.getMany();
    // console.log({ role, data });
    const menuTree: MenuState[] = [];
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
    // console.log({ Menu, exist });
    if (exist) {
      throw new HttpException('菜单已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const newItem = await this.menuRepository.create(Menu);
    await this.menuRepository.save(newItem);
    return newItem;
  }

  async updateField(field) {
    const { id } = field;
    delete field.id;
    const oldItem = await this.menuRepository.findOne({ where: { id } });
    if (!oldItem) {
      throw new HttpException('菜单不存在', HttpStatus.NOT_FOUND);
    }
    // merge - 将多个实体合并为一个实体。
    const updatedItem = await this.menuRepository.merge(oldItem, {
      ...field,
    });
    // console.log({ field, updatedItem });
    return this.menuRepository.save(updatedItem);
  }

  async findById(id): Promise<Menu | null> {
    return await this.menuRepository.findOne({ where: { id } });
  }

  async deleteById(id) {
    try {
      const menu = await this.menuRepository.findOne({ where: { id } });
      if (!menu) {
        throw new HttpException('菜单不存在', HttpStatus.NOT_FOUND);
      }
      await this.menuRepository.remove(menu);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException('外链已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    const newCategory = await this.linkRepository.create(Link);
    await this.linkRepository.save(newCategory);
    return newCategory;
  }
  async findOne(id: string): Promise<Link> {
    const link = await this.linkRepository.findOne({ where: { id } });
    if (!link) {
      throw new HttpException('外链不存在', HttpStatus.NOT_FOUND);
    }
    return link;
  }

  async findAll(queryParams): Promise<Link[]> {
    const { client } = queryParams;
    // const { articleStatus } = queryParams;
    const sql = this.linkRepository.createQueryBuilder('link');
    // 客戶端只返回已同意申请的
    if (client) {
      sql.andWhere('link.agreed=:agreed', { agreed: true });
    }
    sql.orderBy('link.createTime', 'ASC');
    const data = await sql.getMany();
    return data;
    // return this.linkRepository.find({ order: { createAt: 'ASC' } });
  }

  async updateById(id, item: Partial<Link>): Promise<Link> {
    const oldItem = await this.linkRepository.findOne({ where: { id } });
    if (!oldItem) {
      throw new HttpException('外链不存在', HttpStatus.NOT_FOUND);
    }
    const updatedItem = await this.linkRepository.merge(oldItem, item);
    return this.linkRepository.save(updatedItem);
  }

  async deleteById(id) {
    try {
      const link = await this.linkRepository.findOne({ where: { id } });
      if (!link) {
        throw new HttpException('外链不存在', HttpStatus.NOT_FOUND);
      }
      await this.linkRepository.remove(link);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
