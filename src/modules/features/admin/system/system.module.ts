import { Module } from '@nestjs/common';
import { RoleController } from './controllers/role.controller';
import { PrivilegeController } from './controllers/privilege.controller';
import { DeptController } from './controllers/dept.controller';
import { Role } from './entities/role.entity';
import { Privilege } from './entities/privilege.entity';
import { Dept } from './entities/dept.entity';
import { Menu } from '../../admin/admin.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './services/role.service';
import { PrivilegeService } from './services/privilege.service';
import { DeptService } from './services/dept.service';
import { MenuService } from '../../admin/admin.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Privilege, Dept, Menu])],
  exports: [RoleService],
  providers: [PrivilegeService, RoleService, DeptService, MenuService],
  controllers: [RoleController, PrivilegeController, DeptController],
})
export class SystemModule {}
