import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../auth/roles.guard';
import { ReplyService } from './reply.service';

// 文档
@ApiTags('回复模块')
@Controller('reply')
// 权限
@UseGuards(RolesGuard)
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}
}
