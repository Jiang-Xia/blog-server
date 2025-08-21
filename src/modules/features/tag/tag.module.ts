import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { Tag } from './tag.entity';
import { AuthModule } from '../../security/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Tag]), AuthModule],
  exports: [TagService],
  providers: [TagService],
  controllers: [TagController],
})
export class TagModule {}
