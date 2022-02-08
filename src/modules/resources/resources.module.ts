import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';

@Module({
  imports: [ResourcesService],
  providers: [ResourcesService],
  controllers: [ResourcesController],
})
export class ResourcesModule {}
