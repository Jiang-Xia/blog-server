import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Dept, DeptListVo } from '../entities/dept.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { getPagination } from '@/utils';
import { plainToClass } from 'class-transformer';

@Injectable()
export class DeptService {
  constructor(@InjectRepository(Dept) private readonly deptRepository: Repository<Dept>) {}

  async create(dept: Partial<Dept>): Promise<Dept> {
    console.log(dept, '------------');
    const newModel = await this.deptRepository.create(dept);
    await this.deptRepository.save(newModel);
    return newModel;
  }

  async read(queryParams): Promise<DeptListVo> {
    const { page = 1, pageSize = 20, deptName, parentId = null } = queryParams;
    const sql = this.deptRepository.createQueryBuilder('dept');

    if (deptName) {
      sql.andWhere('dept.deptName like :deptName', { deptName: `%${deptName}%` });
    }

    if (parentId !== null && parentId !== undefined) {
      sql.andWhere('dept.parentId = :parentId', { parentId });
    }

    sql.orderBy('dept.orderNum', 'ASC').addOrderBy('dept.createTime', 'ASC');

    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page);
    // 使用 class-transformer 转换数据，确保日期格式化生效
    const transformedList = list.map((item) => plainToClass(Dept, item));
    return {
      list: transformedList,
      pagination,
    };
  }

  async queryInfo(id: string): Promise<Dept> {
    const dept = await this.deptRepository.findOne({ where: { id } });
    if (!dept) {
      throw new HttpException('部门不存在', HttpStatus.NOT_FOUND);
    }
    return dept;
  }

  async update(id, updateData: Partial<Dept>): Promise<Dept> {
    const oldModel = await this.deptRepository.findOne({ where: { id } });
    if (!oldModel) {
      throw new HttpException('部门不存在', HttpStatus.NOT_FOUND);
    }
    const updatedModel = await this.deptRepository.merge(oldModel, updateData);
    return this.deptRepository.save(updatedModel);
  }

  async delete(id) {
    try {
      const repo = await this.deptRepository.findOne({ where: { id } });
      if (!repo) {
        throw new HttpException('部门不存在', HttpStatus.NOT_FOUND);
      }
      // 检查是否有子部门，如果有则不允许删除
      const childDepts = await this.deptRepository.find({ where: { parentId: Number(id) } });
      if (childDepts.length > 0) {
        throw new HttpException('该部门下存在子部门，无法删除', HttpStatus.BAD_REQUEST);
      }
      await this.deptRepository.remove(repo);
      return true;
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async queryTree(parentId?: string): Promise<Dept[]> {
    // 查询所有部门
    const allDepts = await this.deptRepository.find({
      order: {
        orderNum: 'ASC',
        createTime: 'ASC',
      },
    });
    // console.log(allDepts, 'allDepts');
    // 创建一个 Map 来存储部门，便于快速查找
    const deptMap = new Map();
    allDepts.forEach((dept) => {
      deptMap.set(dept.id, { ...dept, children: [] });
    });

    // 构建树形结构
    allDepts.forEach((dept) => {
      const current = deptMap.get(dept.id);
      if (dept.parentId !== 0 && dept.parentId !== null && dept.parentId !== undefined) {
        // 子节点，找到父节点并添加到其 children 数组中
        const parent = deptMap.get(dept.parentId);
        // console.log(parent, 'parent', deptMap);
        if (parent) {
          parent.children.push(current);
        }
      }
    });

    // 如果指定了parentId，则返回该节点下的完整子树，否则返回根节点
    if (parentId !== undefined && parentId !== null) {
      const targetDept = deptMap.get(parentId);
      return targetDept ? [targetDept] : [];
    }

    // 返回所有根节点
    return Array.from(deptMap.values()).filter((dept) => {
      return dept.parentId === 0 || dept.parentId === null || dept.parentId === undefined;
    });
  }
}
