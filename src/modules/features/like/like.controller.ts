import { Body, Headers, Controller, Delete, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CollectService, LikeService } from './like.service';
import { Like } from './like.entity';
import { IpAddress } from 'src/utils/common';
import { getUid } from '@/utils';
// 文档
@ApiTags('喜欢模块')
@Controller('like')
// 权限
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // https://www.cnblogs.com/xiaoyantongxue/p/15758271.html
  @Post()
  updateLikeById(@IpAddress() ip: string, @Body() LikeDTO: Like) {
    // console.log(LikeDTO);
    LikeDTO.ip = ip;
    return this.likeService.updateLike(LikeDTO);
  }
}

@ApiTags('收藏模块')
@Controller('collect')
// 权限
export class CollectController {
  constructor(private readonly collectService: CollectService) {}
  @Get(':id')
  collectArticle(@Param('id') articleId: string, @Headers() headers) {
    const uid = getUid(headers.authorization);
    return this.collectService.collectArticle(articleId, uid);
  }
  @Delete(':id')
  cancelCollectArticle(@Param('id') id: string) {
    return this.collectService.cancelCollectArticle(id);
  }
  @Get()
  findAllCollectArticle(@Headers() headers) {
    const uid = getUid(headers.authorization);
    return this.collectService.findAllCollectArticle(uid);
  }
}
