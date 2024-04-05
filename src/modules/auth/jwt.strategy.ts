import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entity/user.entity';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'xia-007',
    });
  }

  // 需要权限校验时才会触发这个函数
  async validate(payload: User) {
    console.log(payload, 'payload');
    const user = await this.authService.validateUser(payload);
    console.log('validate-user', user);
    if (!user) {
      throw new UnauthorizedException('身份验证失败');
    }
    return user;
  }
}
