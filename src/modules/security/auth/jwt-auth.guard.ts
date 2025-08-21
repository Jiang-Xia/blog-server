import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  applyDecorators,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../features/user/entity/user.entity';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RolesGuard, Roles } from './roles.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    // console.log('request', request);
    return request;
  }

  /**
   * @description: 经典 泛型约束
   * @param {UnauthorizedException} err
   * @param {T} user T默认为任意类型是没有status的, T需要继承与User才有status 传参需要符合User才行
   * @return {User}
   */
  handleRequest<T extends User>(err: UnauthorizedException, user: T): T {
    // console.log('handleRequest-user', user, err);
    if (err || !user) {
      throw new UnauthorizedException('身份验证失败');
    } else if (user.status === 'locked') {
      throw new UnauthorizedException('账号已被锁定！');
    }
    return user;
  }
}

// 鉴权装饰器聚合
export function Auth(roles?: string[]) {
  return applyDecorators(
    // 登录角色鉴权
    UseGuards(RolesGuard, JwtAuthGuard),
    Roles(roles),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  );
}
