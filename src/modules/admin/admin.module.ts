import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuService } from './admin.service';
import { MenuController } from './admin.controller';
import { Menu } from './admin.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), AuthModule],
  exports: [MenuService],
  providers: [MenuService],
  controllers: [MenuController],
})
export class AdminModule {}
