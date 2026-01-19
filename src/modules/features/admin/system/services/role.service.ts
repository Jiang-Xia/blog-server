import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository, In } from 'typeorm';
import { CreateRoleDTO, Role, RoleListVo, UpdateRoleDTO } from '../entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getPagination } from '@/utils';
import { plainToClass } from 'class-transformer';
import { Privilege } from '../entities/privilege.entity';
import { Menu } from '@/modules/features/admin/admin.entity';
import { MenuService } from '@/modules/features/admin/admin.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Privilege) private readonly privilegeRepository: Repository<Privilege>,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(roleData: CreateRoleDTO): Promise<Role> {
    const role = this.roleRepository.create({
      roleName: roleData.roleName,
      roleDesc: roleData.roleDesc,
    });
    // console.log(roleData, 'roleData');

    // 处理权限ID数组
    role.privileges = await this.privilegeRepository.findByIds(roleData.privileges || []);
    // 处理菜单ID数组
    role.menus = await this.menuRepository.findByIds(roleData.menus || []);

    const newModel = await this.roleRepository.save(role);
    return newModel;
  }

  async read(queryParams): Promise<RoleListVo> {
    const { page = 1, pageSize = 20, roleName } = queryParams;
    const sql = this.roleRepository.createQueryBuilder('role');
    if (roleName) {
      sql.andWhere('role.roleName like :roleName', { roleName: `%${roleName}%` });
    }
    sql.orderBy('role.createTime', 'ASC');
    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page);
    // 使用 class-transformer 转换数据，确保日期格式化生效
    const transformedList = list.map((item) => plainToClass(Role, item));
    return {
      list: transformedList,
      pagination,
    };
  }

  async queryInfo(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['privileges', 'menus'],
    });
    if (!role) {
      throw new HttpException('角色不存在', HttpStatus.NOT_FOUND);
    }
    const menuIds: any[] = role.menus.map((item) => item.id);
    const privilegeIds: any[] = role.privileges.map((item) => String(item.id));

    // 返回角色信息，但只包含ID，不包含完整对象
    const result = {
      ...role,
      privileges: privilegeIds, // 只返回权限ID数组
      menus: menuIds, // 只返回菜单ID数组
      formatDates(): void {
        /* 空实现 */
      }, // 保持类型兼容性
    };
    return result;
  }

  async update(id, updateData: UpdateRoleDTO): Promise<Role> {
    const oldModel = await this.roleRepository.findOne({
      where: { id },
      relations: ['privileges', 'menus'],
    });
    if (!oldModel) {
      throw new HttpException('角色不存在', HttpStatus.NOT_FOUND);
    }

    // 处理权限ID数组
    oldModel.privileges = await this.privilegeRepository.findByIds(updateData.privileges || []);
    // 处理菜单ID数组
    oldModel.menus = await this.menuRepository.findByIds(updateData.menus || []);
    // console.log(oldModel, 'oldModel');
    return this.roleRepository.save(oldModel);
  }

  async delete(id) {
    try {
      const repo = await this.roleRepository.findOne({ where: { id } });
      if (!repo) {
        throw new HttpException('角色不存在', HttpStatus.NOT_FOUND);
      }
      await this.roleRepository.remove(repo);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 获取菜单权限树形数据
   */
  async getMenuPrivilegeTree(): Promise<any[]> {
    // 获取所有菜单
    const menus = await this.menuRepository.find({
      order: { order: 'ASC' },
    });
    // 获取所有权限
    const privileges = await this.privilegeRepository.find();

    // 创建一个 Map 来存储菜单，便于快速查找
    const menuMap = new Map<string, any>();
    menus.forEach((menu) => {
      menuMap.set(menu.id, {
        ...menu,
        children: [],
        label: menu.menuCnName || menu.name,
        value: menu.id,
        type: 'menu',
        privileges: [],
        checkedPrivilegeIds: [],
      });
    });

    // 构建菜单树形结构
    const rootMenus: any[] = [];
    menus.forEach((menu) => {
      const currentMenu = menuMap.get(menu.id);

      // 查找与当前菜单相关的权限
      const menuPrivileges = privileges.filter((privilege) => privilege.privilegePage === menu.id);

      // 添加权限到当前菜单
      const privilegeNodes = menuPrivileges.map((privilege) => ({
        id: privilege.id,
        label: privilege.privilegeName,
        value: String(privilege.id),
        type: 'privilege',
        privilegeId: privilege.id,
        privilegeName: privilege.privilegeName,
        privilegeCode: privilege.privilegeCode,
        privilegePage: privilege.privilegePage,
        isVisible: privilege.isVisible,
      }));

      // 添加权限到菜单
      currentMenu.privileges = menuPrivileges;
      // 将权限节点添加到当前菜单的children中
      currentMenu.children = [...currentMenu.children, ...privilegeNodes];

      if (menu.pid === '0' || !menu.pid) {
        // 根节点
        rootMenus.push(currentMenu);
      } else {
        // 子节点，找到父节点并添加到其 children 数组中
        const parentMenu = menuMap.get(menu.pid);
        if (parentMenu) {
          parentMenu.children.push(currentMenu);
        }
      }
    });

    return rootMenus;
  }
  /*
   * 获取根据用户id获取所属角色信息
   */
  getRoleByUserId(userId: number): Promise<Role[]> {
    return this.roleRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users'],
    });
  }
}
