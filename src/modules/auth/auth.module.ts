import { Module } from '@nestjs/common';
import { AuthService, PrivilegeService, RoleService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { RoleController, PrivilegeController } from './auth.controller';
import { Role } from './entities/role.entity';
import { Privilege } from './entities/privilege.entity';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';

const PassModule = PassportModule.register({ defaultStrategy: 'jwt' });
const jwtModule = JwtModule.register({
  secret: 'xia-007',
  signOptions: { expiresIn: '8h' },
});

@Module({
  imports: [TypeOrmModule.forFeature([Role, Privilege]), UserModule, PassModule, jwtModule],
  exports: [PassModule, jwtModule],
  providers: [AuthService, PrivilegeService, RoleService, JwtStrategy],
  controllers: [RoleController, PrivilegeController],
})
export class AuthModule {}
