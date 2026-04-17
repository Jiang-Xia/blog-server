import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, EntityManager, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { UserService } from '../user/user.service';
import { ReplyService } from '../reply/reply.service';
import { getPagination, setUserInfo } from 'src/utils';
import { ArticleService } from '../article/article.service';
import { RedisService } from '@/modules/core/redis/redis.service';
import { COMMON_BLOCKED_WORDS } from '@/constants/blocked-words';

/** 评论限流窗口（秒） */
const COMMENT_RATE_WINDOW_SEC = 60;
/** 限流窗口内允许的最大评论次数 */
const COMMENT_RATE_MAX_PER_WINDOW = 6;
/** 评论敏感词词库：复用统一常量，避免多处重复维护 */
const COMMENT_BLOCKED_WORDS = COMMON_BLOCKED_WORDS;
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
    private readonly redisService: RedisService,
  ) {}

  /**
   * 评论前风控校验：先做敏感词过滤，再做用户/IP 双维度限流。
   */
  async assertCommentAllowed(content: string, uid: number, ip: string) {
    const normalizedContent = String(content || '').toLowerCase();
    const hitWord = COMMENT_BLOCKED_WORDS.find((word) => normalizedContent.includes(word));
    if (hitWord) {
      throw new HttpException('评论内容包含敏感信息，请修改后提交', HttpStatus.BAD_REQUEST);
    }

    const safeUid = String(uid || '0').replace(/[^0-9a-zA-Z._-]/g, '_');
    const safeIp = String(ip || 'unknown').replace(/[^0-9a-zA-Z._-]/g, '_');
    // 用户 + IP 组合键，兼顾账号刷评和单 IP 攻击场景
    const key = `comment:rate:${safeUid}:${safeIp}`;
    const count = await this.redisService.incrBy(key, 1);
    if (count === 1) {
      await this.redisService.expire(key, COMMENT_RATE_WINDOW_SEC);
    }
    if (count > COMMENT_RATE_MAX_PER_WINDOW) {
      throw new HttpException('评论过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  async create(comment: any) {
    const user = await this.userService.findById(comment.uid);
    const article = await this.articleService.findOneById(comment.articleId);
    let newComment: any = this.commentRepository.create({
      ...comment,
      user: user, // 保存外键需要去查询主表有数据才能保存成功
      article: article,
    });
    // console.log(user, article, newComment);
    newComment = await this.commentRepository.save(newComment);
    return newComment.id;
  }
  async delete(id: string) {
    await this.commentRepository.delete(id);
    this.replyService.deleteByParentId(id);
  }

  // 自己一个个手动查
  // async findAll22(id: number) {
  //   /*
  //   这里可以用三种方式实现：
  //   1.获取评论列表信息的时候连表查询；
  //   2.循环评论信息再通过用户id获取；
  //   3.把用户信息当作缓存放到redis，key是用户id，value是明细
  //   */
  //   // 此方法保存评论时也需要保存用户信息比较麻烦（未成功）
  //   /* const qb = this.commentRepository.createQueryBuilder('comment');
  //   // 联表查询（会自动把关联的字段筛选出来）
  //   qb.leftJoinAndSelect('comment.user', 'user');
  //   // 筛选当前文章的评论
  //   qb.where('comment.articleId = :id', { id });
  //   const list: any[] = await qb.getMany();
  //   // console.log(list);
  //   return list; */
  //   const qb = this.commentRepository.createQueryBuilder('comment');
  //   qb.where('comment.articleId = :id', { id });
  //   qb.addOrderBy('comment.createTime', 'ASC').printSql();
  //   const page = 1;
  //   const pageSize = 100; // 写死获取第一页，一页一百条
  //   const getList = qb
  //     .skip((page - 1) * pageSize)
  //     .take(pageSize)
  //     .getManyAndCount();
  //   const [list, total] = await getList;
  //   // 先保留分页功能（评论多时需要分页展示了）
  //   const pagination = getPagination(total, pageSize, page);
  //   // console.log(list);
  //   // console.log('pagination', pagination);
  //   const sArr = [];
  //   const rArr = [];
  //   // 组装多个异步函数查询
  //   list.forEach((v: any) => {
  //     sArr.push(this.userService.findById(v.uid));
  //     rArr.push(this.replyService.findAll(v.id));
  //   });
  //   console.log(list);
  //   const users = await Promise.all(sArr);
  //   const replys = await Promise.all(rArr);
  //   // console.log('replys', replys);
  //   const data = list.map((v: any, i: number) => {
  //     const { nickname, id, avatar } = users[i];
  //     v.userInfo = { nickname, id, avatar }; // 简洁返回用户信息
  //     v.replys = replys[i].list; // 所有回复列表
  //     v.allReplyCount = replys[i].total; // 一个父级评论下的所有回复数
  //     return v;
  //   });
  //   // console.log(data);
  //   return {
  //     list: data,
  //     pagination,
  //   };
  // }

  // 左联查询
  async findAll(id: string, page = 1, pageSize = 100, sort: 'DESC' | 'ASC' = 'DESC') {
    const qb = this.commentRepository.createQueryBuilder('comment');
    // 联表查询（会自动把关联的字段筛选出来）
    qb.leftJoinAndSelect('comment.user', 'user');
    qb.leftJoinAndSelect('comment.article', 'article');
    // 筛选当前文章的评论
    if (id) {
      qb.where('article.id = :id', { id });
    }
    qb.addOrderBy('comment.createTime', sort).printSql();
    // console.log(list);
    const getList = qb
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    const [list, total] = await getList;
    // 先保留分页功能（评论多时需要分页展示了）
    const pagination = getPagination(total, pageSize, page);
    // console.log(list);
    // console.log('pagination', pagination);
    const rArr: Array<Promise<any>> = [];
    // 组装多个异步函数查询
    list.forEach((v: any) => {
      rArr.push(this.replyService.findAll(v.id));
    });

    const replys = await Promise.all(rArr);
    // console.log('replys', replys);
    const data = list.map((v: any, i: number) => {
      v.userInfo = setUserInfo(v.user); // 简洁返回用户信息
      v.replys = replys[i].list; // 所有回复列表
      v.allReplyCount = replys[i].total; // 一个父级评论下的所有回复数
      v.articleId = v.article.id;
      delete v.user;
      delete v.article;
      return v;
    });
    // console.log(data);
    return {
      list: data,
      pagination,
    };
  }
}
