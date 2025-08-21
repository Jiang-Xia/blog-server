import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../../features/user/user.module';
import { JwtStrategy } from './jwt.strategy';

const PassModule = PassportModule.register({ defaultStrategy: 'jwt' });
const jwtModule = JwtModule.register({
  secret: 'xia-007',
  signOptions: { expiresIn: '8h' },
});

@Module({
  imports: [UserModule, PassModule, jwtModule],
  exports: [PassModule, jwtModule],
  providers: [AuthService, JwtStrategy],
  controllers: [],
})
export class AuthModule {}
