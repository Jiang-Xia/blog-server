import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

// 文档
@ApiTags('评论模块')
@Controller('comment')
// 权限
@UseGuards(RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 创建评论
  @Post('create')
  async create(@Body() comment: Comment) {
    return await this.commentService.create(comment);
  }

  // 刪除评论
  @Delete('delete')
  async delete(@Query('id') id) {
    return await this.commentService.delete(id);
  }

  // 获取对应文章所有评论
  @Get('findAll')
  async getArticleComments(@Query('articleId') id) {
    return await this.commentService.findAll(id);
  }
}
