import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsgboardService } from './msgboard.service';
import { MsgboardController } from './msgboard.controller';
import { Msgboard } from './msgboard.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Msgboard]), AuthModule],
  exports: [MsgboardService, MsgboardService],
  providers: [MsgboardService, MsgboardService],
  controllers: [MsgboardController],
})
export class MsgboardModule {}
