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
  // 根据评论id查找所有的回复
  async findAll(id: number) {}
}
