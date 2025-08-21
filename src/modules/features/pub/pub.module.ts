import { Module } from '@nestjs/common';
import { PubService } from './pub.service';
import { PubController } from './pub.controller';
@Module({
  exports: [PubService],
  providers: [PubService],
  controllers: [PubController],
})
export class PubModule {}
