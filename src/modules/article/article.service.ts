// src/modules/article/article.service.ts

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleEditDTO } from './dto/article-edit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Article } from './entity/article.entity';
import { getPagination } from 'src/utils';
import { TagService } from '../tag/tag.service';
import { CategoryService } from '../category/category.service';
import { LikeService } from '../like/like.service';
import { CommentService } from '../comment/comment.service';

import { User } from '../user/entity/user.entity';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
    private readonly tagService: TagService,
    private readonly categoryService: CategoryService,
    private readonly likeService: LikeService,
    private readonly commentService: CommentService,
  ) {}

  /**
   * 获取文章列表
   * @param listDTO
   * @returns
   */
  async getMore(listDTO: ListDTO, info: User, ip: string) {
    const {
      page = 1,
      pageSize = 10,
      title,
      content,
      category,
      description,
      tags,
      sort,
      client,
      onlyMy,
    } = listDTO;
    const uid = info?.id;
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
    // home 请求不返回已软删除的（禁用）
    if (client) {
      sql.andWhere('article.isDelete=:isDelete', { isDelete: false });
    }

    if (onlyMy) {
      sql.andWhere('article.uid=:uid', { uid });
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
          qb.orWhere('article.contentHtml like :content', {
            content: `%${description}%`,
          });
        }
        // console.log('排序方式:', sort);
        /* 如果你使用了多个.orderBy，后面的将覆盖所有之前的ORDER BY表达式。 */
        // 排序
        if (sort && sort.toUpperCase() === 'ASC') {
          // select * from article a order by a.topping desc,a.uTime asc 先置顶再按时间排序
          // 改为更新时间排序 置顶排序
          // 按最旧排 升序 从小到大
          sql.orderBy({
            'article.topping': 'DESC',
            'article.createTime': 'ASC',
          });
        } else {
          // 按最新排 降序 从大到小
          sql.orderBy({
            'article.topping': 'DESC',
            'article.createTime': 'DESC',
          });
        }
      }),
    );

    // console.warn('查询文章sql：', sql.getSql());
    // 获取查询结果
    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    // let [list, total] = await getList;
    const [list, total] = await getList;
    const likeCounts = await this.findLike(list, ip);
    const commentResArr: any = await this.findComment(list);
    // console.log(commentCounts, '文章列表对应评论');
    // console.log(commentResArr, 'commentResArr');

    const arr = list.map((v: any, i: number) => {
      // 计算所有评论数
      let commentCount = 0;
      commentResArr[i].list.map((v: any) => (commentCount += v.allReplyCount));
      // 点赞统计数
      v.likes = likeCounts[i].count;
      v.checked = likeCounts[i].checked;
      v.commentCount = commentResArr[i].list.length + commentCount; // 评论和回复数
      v.contentHtml = ''; // 置空文章内容
      return v;
    });
    // console.log('文章数：', list.length);
    // console.log({ list });

    const pagination = getPagination(total, pageSize, page);
    return {
      list: arr,
      pagination,
    };
  }
  // 先把文章列表查询出来，再根据列表组装一一根据文章去查询对应点赞数
  async findLike(list: any, ip: string) {
    const sArr = [];
    // 组装多个异步函数查询
    list.forEach((v: any) => {
      sArr.push(this.likeService.findLike(v.id, ip));
    });
    const res = await Promise.all(sArr);
    // console.log(res);
    return res;
  }
  // 查询当前用户是否点赞该文章
  /**
   * 获取指定id文章信息
   * @param idDto
   */
  async findById(idDto: IdDTO, ip: string) {
    const { id } = idDto;
    const query = this.articleRepository
      .createQueryBuilder('article')
      // 把关联的表也查出来 https://typeorm.bootcss.com/select-query-builder
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .where('article.id=:id')
      .orWhere('article.title=:title')
      .printSql()
      .setParameter('id', id)
      .setParameter('title', id);
    const data = await query.getOne();
    const likeCount = await this.likeService.findLike(id, ip);
    // const comments = await this.commentService.findAll(id);
    data.likes = likeCount.count;
    // data.comments = comments;
    data.checked = likeCount.checked;
    // console.log(data);
    if (!query) {
      throw new NotFoundException('找不到文章');
    }
    return {
      info: data,
    };
  }

  // 先把文章列表查询出来，再根据列表组装一一根据文章去查询对应评论数
  async findComment(list: any) {
    const sArr = [];
    // 组装多个异步函数查询
    list.forEach((v: any) => {
      sArr.push(this.commentService.findAll(v.id));
    });
    const res = await Promise.all(sArr);
    return res;
  }

  /**
   * 创建文章
   * @param articleCreateDTO
   * @returns
   */
  async create(article: Partial<Article>, uid: number): Promise<Article> {
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
      uTime: new Date(),
      uid,
      category: existCategory,
      tags,
    });
    // console.log(newArticle);
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
    // articleToUpdate.content = articleEditDTO.content;
    articleToUpdate.contentHtml = articleEditDTO.contentHtml;
    articleToUpdate.cover = articleEditDTO.cover;
    articleToUpdate.category = articleEditDTO.category;
    // 只有admin端才传
    if (articleToUpdate.isDelete !== undefined) {
      articleToUpdate.isDelete = articleEditDTO.isDelete;
    }
    // 需要去数据库找那个查询是否存在，才能赋值更新
    const tags = await this.tagService.findByIds(
      ('' + articleEditDTO.tags).split(','),
    );
    articleToUpdate.tags = tags;
    articleToUpdate.uTime = new Date();
    // console.log({ articleToUpdate });
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
    const { id, uid } = idDTO;
    const articleToUpdate = await this.articleRepository.findOne({ id });
    if (articleToUpdate.uid === uid) {
      await this.articleRepository.delete(id);
      return {
        info: {
          message: '删除成功',
        },
      };
    } else {
      throw new HttpException('权限不足', HttpStatus.UNAUTHORIZED);
    }
  }

  /**
   * 更新指定文章阅读量 + 1
   * @param id
   * @param article
   */
  async updateViewsById(id): Promise<Article> {
    const oldArticle = await this.articleRepository.findOne(id);
    // merge - 将多个实体合并为一个实体。
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      views: oldArticle.views + 1,
    });
    return this.articleRepository.save(updatedArticle);
  }

  /**
   * @description: 更新文章字段  文章 禁用和置顶
   * @return {*} 设置成功信息
   */
  async updateArticleField(field) {
    const { id } = field;
    delete field.id;
    const oldArticle = await this.articleRepository.findOne(id);
    // merge - 将多个实体合并为一个实体。
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      ...field,
    });
    return this.articleRepository.save(updatedArticle);
  }

  // /**
  //  * 更新喜欢数
  //  * @param id
  //  * @returns
  //  */
  async updateLikesById(articleId: number, status: number): Promise<Article> {
    const oldArticle = await this.articleRepository.findOne(articleId);
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      likes: status === 1 ? oldArticle.likes + 1 : oldArticle.likes - 1,
    });
    return this.articleRepository.save(updatedArticle);
  }

  /**
   * 获取文章归档
   */
  async getArchives(): Promise<{ [key: string]: Article[] }> {
    const data = await this.articleRepository.find({
      where: { status: 'publish' },
      order: { createTime: 'DESC' },
    });
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const ret = {};
    data.forEach((d) => {
      const year = new Date(d.createTime).getFullYear();
      const month = new Date(d.createTime).getMonth();
      // 分年
      if (!ret[year]) {
        ret[year] = {};
      }
      // 分月并转换月份
      if (!ret[year][months[month]]) {
        ret[year][months[month]] = [];
      }
      // 优化 只返回用到的字段
      const { title, id, createTime, uTime } = d;
      const rep = {
        title,
        id,
        createTime,
        uTime,
      };
      ret[year][months[month]].push(rep);
    });
    return ret;
  }
}
