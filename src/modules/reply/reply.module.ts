import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply } from './reply.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), AuthModule],
  exports: [ReplyService],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}
