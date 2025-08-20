import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, EntityManager, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { UserService } from '../user/user.service';
import { ReplyService } from '../reply/reply.service';
import { getPagination, setUserInfo } from 'src/utils';
import { ArticleService } from '../article/article.service';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
    private readonly replyService: ReplyService,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
  ) {}
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
  async findAll(id: string) {
    const qb = this.commentRepository.createQueryBuilder('comment');
    // 联表查询（会自动把关联的字段筛选出来）
    qb.leftJoinAndSelect('comment.user', 'user');
    qb.leftJoinAndSelect('comment.article', 'article');
    // 筛选当前文章的评论
    qb.where('article.id = :id', { id });
    qb.addOrderBy('comment.createTime', 'ASC').printSql();
    // console.log(list);
    const page = 1;
    const pageSize = 100; // 写死获取第一页，一页一百条
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
