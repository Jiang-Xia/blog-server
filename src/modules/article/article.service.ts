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
import * as dayjs from 'dayjs';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
  ) {}

  /**
   * 获取文章列表
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
      sort,
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
        // 排序
        if (sort && sort.toUpperCase() === 'ASC') {
          // 按最新排
          sql.addOrderBy('article.updateTime', 'ASC');
        } else {
          // 按最旧排
          sql.addOrderBy('article.updateTime', 'DESC');
        }
      }),
    );

    // 获取查询结果
    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    // let [list, total] = await getList;
    const [list, total] = await getList;
    const arr = list.map((v: any) => {
      v.uTime = dayjs(v.updateTime).format('YYYY-MM-DD hh:mm:ss');
      return v;
    });
    // console.log('文章数：', list.length);
    const pagination = getPagination(total, pageSize, page);
    return {
      list: arr,
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
    data.uTime = dayjs(data.uTime).format('YYYY-MM-DD hh:mm:ss');
    // console.log(data);
    if (!query) {
      throw new NotFoundException('找不到文章');
    }
    return {
      info: data,
    };
  }
  /**
   * 创建文章
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
    // console.log('创建文章', article);
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
   * 编辑文章
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
   * 删除文章
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

  /**
   * 更新指定文章阅读量 + 1
   * @param id
   * @param article
   */
  async updateViewsById(id): Promise<Article> {
    const oldArticle = await this.articleRepository.findOne(id);
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      views: oldArticle.views + 1,
    });
    return this.articleRepository.save(updatedArticle);
  }

  /**
   * 更新喜欢数
   * @param id
   * @returns
   */
  async updateLikesById(id, type): Promise<Article> {
    const oldArticle = await this.articleRepository.findOne(id);
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      likes: type === 'like' ? oldArticle.likes + 1 : oldArticle.likes - 1,
    });
    return this.articleRepository.save(updatedArticle);
  }
}
