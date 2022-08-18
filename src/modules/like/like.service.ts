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
    const { articleId, uid } = LikeDTO;
    if (LikeDTO.status) {
      const [list, count] = await this.likeRepository.findAndCount({
        where: { articleId, uid },
      });
      if (count) {
        throw new NotFoundException('该文章您已点赞！');
      }
      // 新增
      this.likeRepository.save(LikeDTO);
    } else {
      const list = await this.likeRepository.find({
        where: { articleId, uid },
      });
      // 删除
      this.likeRepository.delete(list[0].id);
    }
  }

  async findLike(articleId: number, uid: number) {
    const [list, count] = await this.likeRepository.findAndCount({
      where: {
        articleId,
      },
    });
    // 判断当前用户是否点赞过当前文章
    const [list2, count2] = await this.likeRepository.findAndCount({
      where: {
        articleId,
        uid,
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
