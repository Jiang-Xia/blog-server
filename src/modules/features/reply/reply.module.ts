import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReplyService } from './reply.service';
import { ReplyController } from './reply.controller';
import { Reply } from './reply.entity';
import { AuthModule } from '../../security/auth/auth.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), AuthModule, UserModule],
  exports: [ReplyService],
  providers: [ReplyService],
  controllers: [ReplyController],
})
export class ReplyModule {}
