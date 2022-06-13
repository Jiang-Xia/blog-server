import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ReplyModule } from '../reply/reply.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    AuthModule,
    UserModule,
    ReplyModule,
  ],
  exports: [CommentService],
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
