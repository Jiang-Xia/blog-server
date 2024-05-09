import { Module } from '@nestjs/common';
import { RoleController, PrivilegeController } from './system.controller';
import { Role } from './entities/role.entity';
import { Privilege } from './entities/privilege.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivilegeService, RoleService } from './system.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Privilege])],
  exports: [],
  providers: [PrivilegeService, RoleService],
  controllers: [RoleController, PrivilegeController],
})
export class SystemModule {}
