import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { JwtAuthGuard } from '../../security/auth/jwt-auth.guard';
import { IpAddress } from '@/utils/common';

// 文档
@ApiTags('评论模块')
@Controller('comment')
// 权限
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 创建评论
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() comment: Comment, @IpAddress() ip: string) {
    if (!comment.uid) {
      throw new HttpException('请先登录！', HttpStatus.UNAUTHORIZED);
    }
    await this.commentService.assertCommentAllowed(comment.content, comment.uid, ip);
    return await this.commentService.create(comment);
  }

  // 刪除评论
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async delete(@Query('id') id: string) {
    return await this.commentService.delete(id);
  }

  // 获取对应文章所有评论
  @Get('findAll')
  async getArticleComments(
    @Query('articleId') id: string,
    @Query('page') page: string = '1',
    @Query('pageSize') pageSize: string = '100',
    @Query('sort') sort: 'DESC' | 'ASC' = 'DESC',
  ) {
    return await this.commentService.findAll(id, Number(page), Number(pageSize), sort);
  }
}
