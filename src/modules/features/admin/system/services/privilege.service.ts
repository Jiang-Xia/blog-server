import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CreatePrivilegeDTO,
  Privilege,
  PrivilegeListVo,
  UpdatePrivilegeDTO,
} from '../entities/privilege.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getPagination } from '@/utils';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(Privilege) private readonly privilegeRepository: Repository<Privilege>,
  ) {}

  async create(privilege: CreatePrivilegeDTO): Promise<Privilege> {
    const newModel = await this.privilegeRepository.create(privilege);
    await this.privilegeRepository.save(newModel);
    return newModel;
  }

  async read(queryParams): Promise<PrivilegeListVo> {
    const { page = 1, pageSize = 20, privilegeName } = queryParams;
    const sql = this.privilegeRepository.createQueryBuilder('privilege');
    if (privilegeName) {
      sql.andWhere('privilege.privilegeName like :privilegeName', {
        privilegeName: `%${privilegeName}%`,
      });
    }
    sql.orderBy('privilege.createTime', 'ASC');
    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page);
    // 使用 class-transformer 转换数据，确保日期格式化生效
    const transformedList = list.map((item) => plainToClass(Privilege, item));
    return {
      list: transformedList,
      pagination,
    };
  }

  async queryInfo(id: number): Promise<Privilege> {
    const privilege = await this.privilegeRepository.findOne({ where: { id } });
    if (!privilege) {
      throw new HttpException('权限不存在', HttpStatus.NOT_FOUND);
    }
    return privilege;
  }

  async update(id, updateData: UpdatePrivilegeDTO): Promise<Privilege> {
    const oldModel = await this.privilegeRepository.findOne({ where: { id } });
    if (!oldModel) {
      throw new HttpException('权限不存在', HttpStatus.NOT_FOUND);
    }
    const updatedModel = await this.privilegeRepository.merge(oldModel, updateData);
    return this.privilegeRepository.save(updatedModel);
  }

  async delete(id) {
    try {
      const repo = await this.privilegeRepository.findOne({ where: { id } });
      if (!repo) {
        throw new HttpException('权限不存在', HttpStatus.NOT_FOUND);
      }
      await this.privilegeRepository.remove(repo);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /* 根据角色id查询权限 */
  async queryByRoleId(roleId: number): Promise<Privilege[]> {
    const queryResult = await this.privilegeRepository
      .createQueryBuilder('privilege')
      .leftJoinAndSelect('privilege.roles', 'roles')
      .where('roles.id = :roleId', { roleId })
      .getMany();
    return queryResult;
  }
}
