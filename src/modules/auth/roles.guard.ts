import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { User } from '../user/entity/user.entity';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    // console.log('roles', roles);
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    let token = request.headers.authorization;
    if (/Bearer/.test(token)) {
      // 不需要 Bearer，否则验证失败
      token = token.split(' ').pop();
    }
    // console.log('token', token);
    const user = this.jwtService.decode(token) as User;
    // console.log('user', user);
    if (!user) {
      return false;
    }
    const hasRole = roles.some((role) => role === user.role);
    // console.log(user, user.role, hasRole);
    if (user && user.role && hasRole) {
      return true;
    } else {
      // 主动抛异常
      throw new UnauthorizedException('权限不足！');
    }
  }
}
