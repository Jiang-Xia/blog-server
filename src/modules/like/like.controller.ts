import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { CollectService, LikeService } from './like.service';
// 文档
@ApiTags('喜欢模块')
@Controller('like')
// 权限
@UseGuards(RolesGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  // https://www.cnblogs.com/xiaoyantongxue/p/15758271.html
  @Get('id')
  getLike() {
    return [];
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
