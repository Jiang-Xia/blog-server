import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { Reply } from './reply.entity';
@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
    private readonly userService: UserService,
  ) {}
  async create(comment: any) {
    const newComment: any = await this.replyRepository.create(comment);
    await this.replyRepository.save(newComment);
  }
  async delete(id: string) {
    await this.replyRepository.delete(id);
  }
  // 删除评论是会把改评论下的所有
  deleteByParentId(id: string) {}
  // 根据评论id查找所有的回复
  async findAll(id: number) {
    const qb = this.replyRepository.createQueryBuilder('reply');
    qb.where('reply.parentId = :id', { id });
    const getList = qb.getManyAndCount();
    const [list, total] = await getList;
    const uArr = []; // 组装promise任务
    const tArr = [];
    // 组装多个异步函数查询
    list.forEach((v: any) => {
      uArr.push(this.userService.findById(v.uid));
      tArr.push(this.userService.findById(v.replyUid));
    });
    // 两个操作可以同步进行
    // const alldata = await Promise.all([
    //   async () => await Promise.all(uArr),
    //   async () => await Promise.all(tArr),
    // ]);
    // console.log(alldata);
    const uUsers = await Promise.all(uArr); // 对应回复评论用户数据
    const tUsers = await Promise.all(tArr); // 对应回复评论目标用户数据
    const data = list.map((v: any, i: number) => {
      const { nickname, id } = uUsers[i];
      v.userInfo = { nickname, id };
      v.tUserInfo = { nickname: tUsers[i].nickname, id: tUsers[i].id }; // 目标用户
      return v;
    });
    return {
      list: data,
      total,
    };
  }
}
