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

// 设置缓存限制接口请求次数
// export const CacheLimit = createParamDecorator(async (data: unknown, ctx: ExecutionContext) => {
//   const maxCount = 3;
//   let count: number = await this.cacheManager.get(ip);
//   console.log({ [ip]: count });
//   if (!count) {
//     this.cacheManager.set(ip, 1, 1000 * 10);
//     const count2: number = await this.cacheManager.get(ip);
//     console.log({ [ip]: count2 });
//   } else if (count < maxCount) {
//     count += 1;
//     this.cacheManager.set(ip, count);
//     return this.msgboardService.findAll();
//   } else {
//     return [];
//   }
// });
