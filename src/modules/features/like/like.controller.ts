import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../security/auth/roles.guard';
import { CollectService, LikeService } from './like.service';
import { Like, Collect } from './like.entity';
import { IpAddress } from 'src/utils/common';
// 文档
@ApiTags('喜欢模块')
@Controller('like')
// 权限
@UseGuards(RolesGuard)
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
@UseGuards(RolesGuard)
export class CollectController {
  constructor(private readonly likeService: CollectService) {}
  @Get('id')
  getLike() {
    return [];
  }
}
