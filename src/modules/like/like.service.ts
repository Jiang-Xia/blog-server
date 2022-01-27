import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, Collect } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}
  updateLike(LikeDTO: Like) {
    if (LikeDTO.status) {
      // 新增
      this.likeRepository.save(LikeDTO);
    } else {
      // 删除
      this.likeRepository.delete(LikeDTO.id);
    }
  }
}

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Collect)
    private readonly collectRepository: Repository<Collect>,
  ) {}
}
