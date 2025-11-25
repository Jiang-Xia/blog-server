import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { PayService } from './pay.service';
import { PayController } from './pay.controller';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [PayController],
  providers: [PayService],
  exports: [PayService],
})
export class PayModule {}
