import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';

// 自定义参数装饰器
export const IpAddress = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  if (req.clientIp) return req.clientIp;
  return requestIp.getClientIp(req) as string;
});
