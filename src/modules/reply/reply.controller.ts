import { Body, Controller, Delete, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReplyService } from './reply.service';
import { Reply } from './reply.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

// 文档
@ApiTags('回复模块')
@Controller('reply')
// 权限
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  // 创建回复
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() reply: Reply) {
    return await this.replyService.create(reply);
  }

  // 刪除评论
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Query('id') id: string) {
    return await this.replyService.delete(id);
  }

  // 获取对应文章所有评论
  @Get('findAll')
  async getArticleReplys(@Query('articleId') id: string) {
    return await this.replyService.findAll(id);
  }
}
