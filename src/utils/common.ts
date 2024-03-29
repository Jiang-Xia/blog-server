import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';

/* 自定义参数装饰器 */
// 获取ip地址
export const IpAddress = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  // console.log({
  //   // req: req.headers,
  //   'req.clientIp': req.clientIp,
  //   'requestIp.getClientIp(req)': requestIp.getClientIp(req),
  // });
  if (req.clientIp) return req.clientIp;
  return requestIp.getClientIp(req) as string;
});
