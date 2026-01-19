import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService, LinkService } from './admin.service';
import { MenuController, LinkController } from './admin.controller';
import { Menu, Link } from './admin.entity';
import { AuthModule } from '../../security/auth/auth.module';
import { SystemModule } from './system/system.module';

const modules = [SystemModule];
@Module({
  imports: [TypeOrmModule.forFeature([Menu, Link]), ...modules, AuthModule],
  exports: [MenuService, LinkService, SystemModule],
  providers: [MenuService, LinkService],
  controllers: [MenuController, LinkController],
})
export class AdminModule {}
