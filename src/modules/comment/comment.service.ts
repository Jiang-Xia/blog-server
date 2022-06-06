import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, EntityManager, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';
import { getPagination } from 'src/utils';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly userService: UserService,
  ) {}
  async create(comment: any) {
    const newComment: any = await this.commentRepository.create(comment);
    await this.commentRepository.save(newComment);
  }
  async delete(id: string) {
    await this.commentRepository.delete(id);
  }
  async findAll(id: number) {
    /* 
    这里可以用三种方式实现：
    1.获取评论列表信息的时候连表查询；
    2.循环评论信息再通过用户id获取；
    3.把用户信息当作缓存放到redis，key是用户id，value是明细
    */
    // 此方法保存评论时也需要保存用户信息比较麻烦（未成功）
    /* const qb = this.commentRepository.createQueryBuilder('comment');
    // 联表查询（会自动把关联的字段筛选出来）
    qb.leftJoinAndSelect('comment.user', 'user');
    // 筛选当前文章的评论
    qb.where('comment.articleId = :id', { id });
    const list: any[] = await qb.getMany();
    // console.log(list);
    return list; */
    const qb = this.commentRepository.createQueryBuilder('comment');
    qb.where('comment.articleId = :id', { id });
    qb.addOrderBy('comment.createTime', 'ASC');
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
    const sArr = [];
    const rArr = [];
    // 组装多个异步函数查询
    list.forEach((v: any) => {
      sArr.push(this.userService.findById(v.uid));
    });

    const users = await Promise.all(sArr);
    const data = list.map((v: any, i: number) => {
      v.userInfo = users[i];
      return v;
    });
    // console.log(data);
    return {
      list: data,
      pagination,
    };
  }
}
