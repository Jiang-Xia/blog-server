import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { getRandomClor, likeQeuryParams } from '../../utils/index';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  /**
   * 添加分类
   * @param Category
   */
  async create(Category: Partial<Category>): Promise<Category> {
    const { label } = Category;
    const existCategory = await this.categoryRepository.findOne({
      where: { label },
    });

    if (existCategory) {
      throw new HttpException('分类已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const newCategory = await this.categoryRepository.create(Category);
    newCategory.color = getRandomClor();
    await this.categoryRepository.save(newCategory);
    return newCategory;
  }

  /**
   * 获取所有分类
   */
  async findAll(queryParams): Promise<Category[]> {
    const { isDelete = false, title } = queryParams;
    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .orderBy('category.createAt', 'ASC');
    likeQeuryParams(qb, 'category', { label: title });
    //增加是否发布字段
    if (isDelete) {
      qb.leftJoinAndSelect('category.articles', 'articles', 'articles.isDelete=:isDelete', {
        isDelete,
      });
    } else {
      qb.leftJoinAndSelect('category.articles', 'articles');
    }
    const data = await qb.getMany();

    data.forEach((d) => {
      // 启用的才合计
      Object.assign(d, { articleCount: d.articles.length });
      delete (d as any).articles;
    });
    data.sort(function (a: any, b: any) {
      return b.articleCount - a.articleCount;
    });
    return data;

    // return this.categoryRepository.find({ order: { createAt: 'ASC' } });
  }

  /**
   * 获取指定分类
   * @param id
   */
  async findById(id): Promise<Category> {
    const data = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id=:id')
      .orWhere('category.label=:id')
      .orWhere('category.value=:id')
      .setParameter('id', id)
      .getOne();

    return data as Category;
  }

  async findByIds(ids): Promise<Array<Category>> {
    return this.categoryRepository.findByIds(ids);
  }

  /**
   * 更新分类
   * @param id
   * @param Category
   */
  async updateById(id: string, category: Partial<Category>): Promise<Category> {
    const oldCategory = await this.categoryRepository.findOne({ where: { id } });
    if (!oldCategory) {
      throw new HttpException('分类不存在', HttpStatus.NOT_FOUND);
    }
    const updatedCategory = await this.categoryRepository.merge(oldCategory, category);
    return this.categoryRepository.save(updatedCategory);
  }

  /**
   * 删除分类
   * @param id
   */
  async deleteById(id) {
    try {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) {
        throw new HttpException('分类不存在', HttpStatus.NOT_FOUND);
      }
      await this.categoryRepository.remove(category);
      return true;
    } catch (e) {
      throw new HttpException('删除失败，可能存在关联文章', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
