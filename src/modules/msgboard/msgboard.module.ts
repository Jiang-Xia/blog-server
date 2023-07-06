import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsgboardService } from './msgboard.service';
import { MsgboardController } from './msgboard.controller';
import { Msgboard } from './msgboard.entity';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [TypeOrmModule.forFeature([Msgboard]), CacheModule.register(), AuthModule, HttpModule],
  exports: [MsgboardService, MsgboardService],
  providers: [MsgboardService, MsgboardService],
  controllers: [MsgboardController],
})
export class MsgboardModule {}
