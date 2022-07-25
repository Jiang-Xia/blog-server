import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService, LinkService } from './admin.service';
import { MenuController, LinkController } from './admin.controller';
import { Menu, Link } from './admin.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Link]), AuthModule],
  exports: [MenuService, LinkService],
  providers: [MenuService, LinkService],
  controllers: [MenuController, LinkController],
})
export class AdminModule {}
