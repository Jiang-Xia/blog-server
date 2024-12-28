import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Privilege } from './entities/privilege.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RoleService {
  constructor(@InjectRepository(Role) private readonly roleRepository: Repository<Role>) {}
  async create(role: Partial<Role>): Promise<Role> {
    const newTag = await this.roleRepository.create(role);
    await this.roleRepository.save(newTag);
    return newTag;
  }

  async read(queryParams): Promise<Role[]> {
    const { isDelete = false, title } = queryParams;
    const qb = this.roleRepository.createQueryBuilder('role').orderBy('role.createAt', 'ASC');
    const data = await qb.getMany();
    return data;
  }

  async update(id, updateData: Partial<Role>): Promise<Role> {
    const oldModel = await this.roleRepository.findOne({ where: { id } });
    const updatedModel = await this.roleRepository.merge(oldModel, updateData);
    return this.roleRepository.save(updatedModel);
  }

  async delete(id) {
    try {
      const repo = await this.roleRepository.findOne({ where: { id } });
      await this.roleRepository.remove(repo);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(Privilege) private readonly privilegeRepository: Repository<Privilege>,
  ) {}

  async create(privilege: Partial<Privilege>): Promise<Privilege> {
    // const { label } = tag;
    // const existTag = await this.privilegeRepository.findOne({ where: { label } });

    // if (existTag) {
    //   throw new HttpException('标签已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    // }
    const newModel = await this.privilegeRepository.create(privilege);
    return newModel;
  }

  async read(queryParams): Promise<Privilege[]> {
    const { isDelete = false, title } = queryParams;
    const qb = this.privilegeRepository
      .createQueryBuilder('privilege')
      .orderBy('tag.createAt', 'ASC');
    const data = await qb.getMany();
    return data;
  }

  async update(id, updateData: Partial<Privilege>): Promise<Privilege> {
    const oldModel = await this.privilegeRepository.findOne({ where: { id } });
    const updatedModel = await this.privilegeRepository.merge(oldModel, updateData);
    return this.privilegeRepository.save(updatedModel);
  }

  async delete(id) {
    try {
      const repo = await this.privilegeRepository.findOne({ where: { id } });
      await this.privilegeRepository.remove(repo);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
