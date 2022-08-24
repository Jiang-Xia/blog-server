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
      // 同一文章和同一ip点赞数不能超过二十次
      if (count > 20) {
        throw new NotFoundException('该文章您点赞太过频繁了！');
      }
      if (!LikeDTO.uid) {
        LikeDTO.id = undefined;
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

  async findLike(articleId: number, ip: string) {
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
      checked: !!count2,
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
