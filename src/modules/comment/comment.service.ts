import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}
  async create() {}
  async delete() {}
  async findAll(id: number) {
    const qb = this.commentRepository.createQueryBuilder('comment');
    qb.where('comment.articleId = :id', { id });
    const data = await qb.getMany();
    return data;
  }
}
