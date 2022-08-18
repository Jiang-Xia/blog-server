import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, Collect } from './like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}
  async updateLike(LikeDTO: Like) {
    // console.log(data);
    const { articleId, ip } = LikeDTO;
    if (LikeDTO.status) {
      const [list, count] = await this.likeRepository.findAndCount({
        where: { articleId, ip },
      });
      if (count) {
        throw new NotFoundException('该文章您已点赞！');
      }
      // 新增
      this.likeRepository.save(LikeDTO);
    } else {
      const list = await this.likeRepository.find({
        where: { articleId, ip },
      });
      // 删除
      this.likeRepository.delete(list[0].id);
    }
  }

  async findLike(articleId: number, ip: number) {
    const [list, count] = await this.likeRepository.findAndCount({
      where: {
        articleId,
      },
    });
    // 判断当前用户是否点赞过当前文章
    const [list2, count2] = await this.likeRepository.findAndCount({
      where: {
        articleId,
        ip,
      },
    });
    return {
      count,
      checked: count2,
    };
  }
}

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Collect)
    private readonly collectRepository: Repository<Collect>,
  ) {}
}
