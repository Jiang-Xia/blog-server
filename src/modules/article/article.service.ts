// src/modules/article/article.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { ArticleCreateDTO } from './dto/article-create.dto';
import { ArticleEditDTO } from './dto/article-edit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from './entity/article.entity';
import { getPagination } from 'src/utils';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  /**
   *
   * @param listDTO
   * @returns
   */
  async getMore(listDTO: ListDTO) {
    const { page = 1, pageSize = 10 } = listDTO;
    const getList = this.articleRepository
      .createQueryBuilder('article')
      .where({ isDelete: false })
      .select([
        'article.id',
        'article.title',
        'article.description',
        'article.createTime',
        'article.category',
        // 'article.tags',
      ])
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page);

    return {
      list,
      pagination,
    };
  }

  /**
   *
   * @param idDto
   * @returns
   */
  async getOne(idDto: IdDTO) {
    const { id } = idDto;
    const articleDetial = await this.articleRepository
      .createQueryBuilder('article')
      .where('article.id = :id', { id })
      .getOne();

    if (!articleDetial) {
      throw new NotFoundException('找不到文章');
    }

    return {
      info: articleDetial,
    };
  }

  /**
   *
   * @param articleCreateDTO
   * @returns
   */
  async create(articleCreateDTO: ArticleCreateDTO) {
    const article = new Article();
    const { title, description, content, category, tags } = articleCreateDTO;
    article.title = title;
    article.description = description;
    article.content = content;
    article.category = category;
    article.tags = tags;
    console.log('创建文章', article);
    const result = await this.articleRepository.save(article);

    return {
      info: result,
    };
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
