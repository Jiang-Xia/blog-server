import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectService, LikeService } from './like.service';
import { CollectController, LikeController } from './like.controller';
import { Like, Collect } from './like.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Collect]), AuthModule],
  exports: [LikeService, CollectService],
  providers: [LikeService, CollectService],
  controllers: [LikeController, CollectController],
})
export class LikeModule {}
