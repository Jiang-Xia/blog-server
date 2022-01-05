import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { CommentService } from './comment.service';

// 文档
@ApiTags('评论模块')
@Controller('comment')
// 权限
@UseGuards(RolesGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
}
