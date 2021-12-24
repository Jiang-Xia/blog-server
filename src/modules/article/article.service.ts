// src/modules/article/article.service.ts

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleCreateDTO } from './dto/article-create.dto';
import { ArticleEditDTO } from './dto/article-edit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Article } from './entity/article.entity';
import { getPagination } from 'src/utils';
import { TagService } from '../tag/tag.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   *
   * @param listDTO
   * @returns
   */
  async getMore(listDTO: ListDTO) {
    const {
      page = 1,
      pageSize = 10,
      title,
      content,
      category,
      description,
      tags,
    } = listDTO;
    const sql = this.articleRepository.createQueryBuilder('article');
    sql
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags');

    // 对应的分类 ok
    if (category) {
      // 分类与其他条件为and
      sql.andWhere('category.id=:category', { category });
      // SELECT ... FROM users user WHERE user.firstName = 'Timber' AND user.lastName = 'Saw'
    }
    // 对应的标签 (单条标签可以了)
    if (tags && tags.length) {
      // 标签之间为in操作类似 or
      sql.andWhere('tags.id IN (:...tags)', { tags });
      // WHERE user.name IN ('Timber', 'Cristal', 'Lina')
    }
    // 关键字查询
    sql.andWhere(
      new Brackets((qb) => {
        // mysql 中 %%代表模糊查询
        // 标题
        if (title) {
          qb.orWhere('article.title like :title', { title: `%${title}%` });
        }
        // 描述
        if (description) {
          qb.orWhere('article.description like :description', {
            description: `%${description}%`,
          });
        }
        // 内容
        if (content) {
          qb.orWhere('article.content like :content', {
            content: `%${description}%`,
          });
        }
      }),
    );

    // 获取查询结果
    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    const [list, total] = await getList;
    // console.log('文章数：', list.length);
    const pagination = getPagination(total, pageSize, page);
    return {
      list,
      pagination,
    };
  }

  /**
   * 获取指定id文章信息
   * @param idDto
   */
  async findById(idDto: IdDTO) {
    const { id } = idDto;
    const query = this.articleRepository
      .createQueryBuilder('article')
      // 把关联的表也查出来 https://typeorm.bootcss.com/select-query-builder
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.id=:id')
      .orWhere('article.title=:title')
      .setParameter('id', id)
      .setParameter('title', id);
    const data = await query.getOne();
    console.log(data);
    if (!query) {
      throw new NotFoundException('找不到文章');
    }
    return {
      info: data,
    };
  }
  /**
   *
   * @param articleCreateDTO
   * @returns
   */
  async create(article: Partial<Article>): Promise<Article> {
    let tags = article.tags;
    const { title = '', category } = article;
    // 查询文章标题是否已经存在
    const exist = await this.articleRepository.findOne({ where: { title } });
    if (exist) {
      throw new HttpException('文章标题已存在', HttpStatus.BAD_REQUEST);
    }
    console.log('创建文章', article);
    // 查询标签
    tags = await this.tagService.findByIds(('' + tags).split(','));
    // 查询分类
    const existCategory = await this.categoryService.findById(category);
    // 创建文章
    const newArticle = await this.articleRepository.create({
      ...article,
      category: existCategory,
      tags,
    });
    await this.articleRepository.save(newArticle);
    return newArticle;
  }

  /**
   *
   * @param articleEditDTO
   * @returns
   */
  async update(articleEditDTO: ArticleEditDTO) {
    const { id } = articleEditDTO;
    const articleToUpdate = await this.articleRepository.findOne({ id });
    articleToUpdate.title = articleEditDTO.title;
    articleToUpdate.description = articleEditDTO.description;
    articleToUpdate.content = articleEditDTO.content;
    const result = await this.articleRepository.save(articleToUpdate);

    return {
      info: result,
    };
  }

  /**
   *
   * @param idDTO
   * @returns
   */
  async delete(idDTO: IdDTO) {
    const { id } = idDTO;
    const articleToUpdate = await this.articleRepository.findOne({ id });
    articleToUpdate.isDelete = true;
    const result = await this.articleRepository.save(articleToUpdate);

    return {
      info: result,
    };
  }
}
