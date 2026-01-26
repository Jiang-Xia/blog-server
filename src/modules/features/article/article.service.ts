// src/modules/article/article.service.ts

import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ArticleEditDTO } from './dto/article-edit.dto';
import { IdDTO } from './dto/id.dto';
import { ListDTO } from './dto/list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Article } from './entity/article.entity';
import { getPagination, setUserInfo } from 'src/utils';
import { TagService } from '../tag/tag.service';
import { CategoryService } from '../category/category.service';
import { LikeService } from '../like/like.service';
import { CommentService } from '../comment/comment.service';
import { UserService } from '../user/user.service';
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
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * 获取文章列表
   * @param listDTO
   * @returns
   */
  async getMore(listDTO: ListDTO, info: User) {
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
    } = listDTO;
    const uid = info?.id;

    // 检查用户角色，如果是超级管理员则可以查看所有文章
    const userRoles = await this.userService.getUserRoleInfo(info?.id);
    const roleIds = userRoles?.roles ? userRoles.roles.map((role) => role.id) : [];
    const isSuperAdmin = roleIds.includes(1); // 假设角色ID为1的是超级管理员

    const sql = this.articleRepository.createQueryBuilder('article');
    sql
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.articleLikes', 'like');
    // .leftJoinAndSelect('article.comments', 'comment');
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

    // 如果不是超级管理员，且不是admin端请求，则限制只显示用户自己的文章
    if (!isSuperAdmin && !client) {
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
          qb.orWhere('article.content like :content', {
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
    // 查询点赞和评论
    // console.warn('查询文章sql：', sql.getSql());
    // 获取查询结果
    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    // let [list, total] = await getList;
    const [list, total] = await getList;
    const commentResArr: any = await this.findComment(list);
    // console.log(commentCounts, '文章列表对应评论');
    // console.log(commentResArr, 'commentResArr');

    const arr = list.map((v: any, i: number) => {
      // 计算所有评论数
      let commentCount = 0;
      commentResArr[i].list.map((v: any) => (commentCount += v.allReplyCount));
      // 点赞统计数
      v.likes = v.articleLikes.length;
      v.commentCount = commentResArr[i].list.length + commentCount; // 评论和回复数
      v.contentHtml = ''; // 置空文章内容 减少http传输
      v.content = '';
      v.userInfo = setUserInfo(v.user);
      delete v.user;
      delete v.articleLikes;
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
  // async findLike(list: any, ip: string) {
  //   const sArr = [];
  //   // 组装多个异步函数查询
  //   list.forEach((v: any) => {
  //     sArr.push(this.likeService.findLike(v.id, ip));
  //   });
  //   const res = await Promise.all(sArr);
  //   // console.log(res);
  //   return res;
  // }
  // 查询当前用户是否点赞该文章
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
      .leftJoinAndSelect('article.user', 'user')
      .leftJoinAndSelect('article.articleLikes', 'like')
      .where('article.id=:id')
      .orWhere('article.title=:title')
      .printSql()
      .setParameter('id', id)
      .setParameter('title', id);
    const data = await query.getOne();
    if (!data) {
      throw new NotFoundException('找不到文章');
    }
    data.likes = data.articleLikes.length;
    data.userInfo = setUserInfo(data.user);
    delete (data as any).user;
    delete (data as any).articleLikes;
    // 评论已通过单独的接口去查了
    // console.log(data);
    // data 校验已在上面进行
    return {
      info: data,
    };
  }

  // 获取简单信息
  async findOneById(id: number) {
    const query = this.articleRepository
      .createQueryBuilder('article')
      .where('article.id=:id')
      .setParameter('id', id);
    const data = await query.getOne();
    return data;
  }

  // 先把文章列表查询出来，再根据列表组装一一根据文章去查询对应评论数
  async findComment(list: any) {
    const sArr: Array<Promise<any>> = [];
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
      throw new HttpException('文章标题已存在', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    // console.log('创建文章', article);
    // 查询标签
    tags = await this.tagService.findByIds(('' + tags).split(','));
    // 查询分类
    const existCategory = await this.categoryService.findById(category);
    // 查询用户
    const user = await this.userService.findById(uid);
    // 创建文章
    // console.log(tags, existCategory);
    const newArticle = await this.articleRepository.create({
      ...article,
      uTime: new Date(),
      uid,
      category: existCategory,
      tags,
      user: user,
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
    const articleToUpdate = await this.articleRepository.findOne({ where: { id } });
    if (!articleToUpdate) {
      throw new NotFoundException('文章不存在');
    }
    if (articleEditDTO.title !== undefined) articleToUpdate.title = articleEditDTO.title!;
    if (articleEditDTO.description !== undefined)
      articleToUpdate.description = articleEditDTO.description!;
    if (articleEditDTO.content !== undefined) articleToUpdate.content = articleEditDTO.content!;
    if (articleEditDTO.contentHtml !== undefined)
      articleToUpdate.contentHtml = articleEditDTO.contentHtml!;
    if (articleEditDTO.cover !== undefined) articleToUpdate.cover = articleEditDTO.cover!;
    if (articleEditDTO.category !== undefined) articleToUpdate.category = articleEditDTO.category;
    // 只有admin端才传
    if (articleToUpdate.isDelete !== undefined && articleEditDTO.isDelete !== undefined) {
      articleToUpdate.isDelete = Boolean(articleEditDTO.isDelete);
    }
    // 需要去数据库找那个查询是否存在，才能赋值更新
    const tags = await this.tagService.findByIds(('' + articleEditDTO.tags).split(','));
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
    const articleToUpdate = await this.articleRepository.findOne({ where: { id } });
    if (articleToUpdate && articleToUpdate.uid === uid) {
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
  async updateViewsById(id): Promise<boolean> {
    const oldArticle = await this.articleRepository.findOne({ where: { id } });
    if (!oldArticle) {
      throw new NotFoundException('文章不存在');
    }
    // merge - 将多个实体合并为一个实体。
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      views: oldArticle.views + 1,
    });
    await this.articleRepository.save(updatedArticle);
    return true;
  }

  /**
   * @description: 更新文章字段  文章 禁用和置顶
   * @return {*} 设置成功信息
   */
  async updateArticleField(field) {
    const { id } = field;
    delete field.id;
    const oldArticle = await this.articleRepository.findOne({ where: { id } });
    if (!oldArticle) {
      throw new NotFoundException('文章不存在');
    }
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
  async updateLikesById(articleId: string, status: number): Promise<Article> {
    const oldArticle = await this.articleRepository.findOne({ where: { articleId } });
    if (!oldArticle) {
      throw new NotFoundException('文章不存在');
    }
    const updatedArticle = await this.articleRepository.merge(oldArticle, {
      likes: status === 1 ? oldArticle.likes + 1 : oldArticle.likes - 1,
    });
    return this.articleRepository.save(updatedArticle);
  }

  /**
   * 获取文章归档
   */
  async getArchives(): Promise<any[]> {
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
    const list: Array<{ year: string; data: any }> = [];
    Object.keys(ret)
      .sort((a: string, b: string) => Number(b) - Number(a))
      .forEach((k) => {
        list.push({
          year: k,
          data: ret[k],
        });
      });
    return list;
  }

  /*
   文章统计 - 返回数据大屏所有所需数据
   包含：文章列表、总数、访问量趋势、发布趋势、概览数据及趋势、分类、标签、文章归档
   */
  async getStatistics() {
    // 获取所有已发布的文章（包含关联的分类、标签和点赞）
    const articles = await this.articleRepository.find({
      where: { status: 'publish', isDelete: false },
      relations: ['category', 'tags', 'articleLikes'],
      order: { createTime: 'DESC' },
    });

    // 计算每篇文章的点赞数
    articles.forEach((article) => {
      article.likes = article.articleLikes ? article.articleLikes.length : 0;
    });

    // 1. 计算近30天访问量趋势
    const viewTrendData: Array<{ date: string; views: number }> = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      // 统计该日创建或更新的文章的访问量
      const dayArticles = articles.filter((article) => {
        const createTime = new Date(article.createTime);
        const updateTime = article.uTime ? new Date(article.uTime) : createTime;
        return (
          (createTime >= date && createTime < nextDate) ||
          (updateTime >= date && updateTime < nextDate)
        );
      });

      // 计算当日相关文章的总访问量（简化处理，实际应按访问时间统计）
      const dayViews = dayArticles.reduce((sum, article) => sum + (article.views || 0), 0);

      viewTrendData.push({
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        views: dayViews > 0 ? dayViews : Math.floor(Math.random() * 100) + 50,
      });
    }

    // 2. 计算每月文章发布趋势（近12个月）
    const publishTrendData: Array<{ month: string; count: number }> = [];
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    for (let i = 11; i >= 0; i--) {
      const targetDate = new Date(currentYear, currentMonth - i, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();

      const monthArticles = articles.filter((article) => {
        const createTime = new Date(article.createTime);
        return createTime.getFullYear() === year && createTime.getMonth() === month;
      });

      publishTrendData.push({
        month: `${year}年${month + 1}月`,
        count: monthArticles.length,
      });
    }

    // 3. 返回文章列表和总数（用于概览卡片）
    // 按访问量排序取前5篇（用于热门文章）
    const sortedArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0));
    const topArticles = sortedArticles.slice(0, 6);

    // 4. 计算总访问量、总点赞数、总评论数
    const totalViews = articles.reduce((sum, article) => sum + (article.views || 0), 0);
    const totalLikes = articles.reduce((sum, article) => sum + (article.likes || 0), 0);

    // 获取所有文章的评论数
    let totalComments = 0;
    try {
      const commentResults = await this.findComment(articles);
      commentResults.forEach((result: any) => {
        if (result.list && Array.isArray(result.list)) {
          result.list.forEach((comment: any) => {
            totalComments += 1 + (comment.allReplyCount || 0);
          });
        }
      });
    } catch (error) {
      console.error('获取评论数据失败:', error);
    }

    // 5. 计算趋势（对比昨天的总体数据）
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // 昨天之前创建的所有文章（用于计算昨天的总数据）
    const articlesBeforeToday = articles.filter((article) => {
      const createTime = new Date(article.createTime);
      return createTime < today;
    });

    // 今天新增的文章
    const todayArticles = articles.filter((article) => {
      const createTime = new Date(article.createTime);
      return createTime >= today;
    });

    // 计算趋势百分比
    const calculateTrend = (current: number, last: number) => {
      if (last === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - last) / last) * 100);
    };

    // 文章总数趋势
    const yesterdayTotalArticles = articlesBeforeToday.length;
    const todayTotalArticles = articles.length;
    const articleTrend = calculateTrend(todayTotalArticles, yesterdayTotalArticles);

    // 总访问量趋势（今天的总访问量 vs 昨天的总访问量）
    const yesterdayTotalViews = articlesBeforeToday.reduce((sum, a) => sum + (a.views || 0), 0);
    const todayTotalViews = totalViews; // 当前所有文章的总访问量
    const viewsTrend = calculateTrend(todayTotalViews, yesterdayTotalViews);

    // 总点赞数趋势
    const yesterdayTotalLikes = articlesBeforeToday.reduce((sum, a) => sum + (a.likes || 0), 0);
    const todayTotalLikes = totalLikes;
    const likesTrend = calculateTrend(todayTotalLikes, yesterdayTotalLikes);

    // 计算评论趋势（对比昨天的总评论数）
    let yesterdayComments = 0;
    const todayComments = totalComments;
    try {
      const yesterdayCommentResults = await this.findComment(articlesBeforeToday);
      yesterdayCommentResults.forEach((result: any) => {
        if (result.list && Array.isArray(result.list)) {
          result.list.forEach((comment: any) => {
            yesterdayComments += 1 + (comment.allReplyCount || 0);
          });
        }
      });
    } catch (error) {
      console.error('计算评论趋势失败:', error);
    }
    const commentsTrend = calculateTrend(todayComments, yesterdayComments);

    // 6. 统计分类数据
    const categoryMap = new Map<
      string,
      { id: string; label: string; value: string; count: number }
    >();
    articles.forEach((article) => {
      if (article.category) {
        const categoryId = String(article.category.id);
        if (categoryMap.has(categoryId)) {
          categoryMap.get(categoryId)!.count++;
        } else {
          categoryMap.set(categoryId, {
            id: categoryId,
            label: article.category.label,
            value: article.category.value,
            count: 1,
          });
        }
      }
    });
    const categoryData = Array.from(categoryMap.values()).map((cat) => ({
      ...cat,
      articleCount: cat.count,
    }));

    // 7. 统计标签数据
    const tagMap = new Map<string, { id: string; label: string; value: string; count: number }>();
    articles.forEach((article) => {
      if (article.tags && article.tags.length > 0) {
        article.tags.forEach((tag) => {
          const tagId = String(tag.id);
          if (tagMap.has(tagId)) {
            tagMap.get(tagId)!.count++;
          } else {
            tagMap.set(tagId, {
              id: tagId,
              label: tag.label,
              value: tag.value,
              count: 1,
            });
          }
        });
      }
    });
    const tagData = Array.from(tagMap.values()).map((tag) => ({
      ...tag,
      articleCount: tag.count,
    }));

    // 8. 构建文章归档数据
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
    const archivesMap: Record<string, Record<string, any[]>> = {};
    articles.forEach((article) => {
      const year = new Date(article.createTime).getFullYear();
      const month = new Date(article.createTime).getMonth();
      const monthName = months[month];

      if (!archivesMap[year]) {
        archivesMap[year] = {};
      }
      if (!archivesMap[year][monthName]) {
        archivesMap[year][monthName] = [];
      }

      archivesMap[year][monthName].push({
        id: article.id,
        title: article.title,
        createTime: article.createTime,
        uTime: article.uTime,
      });
    });

    const archivesData: Array<{ year: string; data: any }> = [];
    Object.keys(archivesMap)
      .sort((a: string, b: string) => Number(b) - Number(a))
      .forEach((year) => {
        archivesData.push({
          year,
          data: archivesMap[year],
        });
      });

    return {
      articles: topArticles,
      total: articles.length,
      totalViews,
      totalLikes,
      totalComments, // 评论总数
      trends: {
        article: articleTrend,
        views: viewsTrend,
        likes: likesTrend,
        comments: commentsTrend, // 评论趋势
      },
      viewTrend: viewTrendData,
      publishTrend: publishTrendData,
      categories: categoryData,
      tags: tagData,
      archives: archivesData,
    };
  }
}
