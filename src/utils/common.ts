import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as requestIp from 'request-ip';
import type { Request } from 'express';

function normalizeIp(ip: string | undefined | null): string {
  if (!ip) {
    return '';
  }
  let value = ip.trim();
  if (!value) {
    return '';
  }
  // 多级代理场景下 x-forwarded-for 可能是 "client, proxy1, proxy2"
  if (value.includes(',')) {
    value = value.split(',')[0].trim();
  }
  // 兼容 IPv4-mapped IPv6：::ffff:127.0.0.1
  if (value.startsWith('::ffff:')) {
    value = value.slice(7);
  }
  // 本地开发常见 IPv6 回环地址，统一成 IPv4 便于日志与下游 key 处理
  if (value === '::1') {
    value = '127.0.0.1';
  }
  return value;
}

function getClientIp(req: Request & { clientIp?: string }): string {
  const xForwardedFor = req.headers['x-forwarded-for'];
  const forwardedIp = Array.isArray(xForwardedFor) ? xForwardedFor[0] : xForwardedFor;
  const xRealIp = req.headers['x-real-ip'];
  const realIp = Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;

  const candidates = [
    normalizeIp(forwardedIp),
    normalizeIp(realIp),
    normalizeIp(req.ip),
    normalizeIp(req.clientIp),
    normalizeIp(requestIp.getClientIp(req)),
    normalizeIp(req.socket?.remoteAddress),
  ];

  const ip = candidates.find(Boolean);
  return ip || 'unknown';
}

/* 自定义参数装饰器 */
// 获取ip地址
export const IpAddress = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest<Request & { clientIp?: string }>();
  const ip = getClientIp(req);
  // 调试用：观察各来源 IP 与最终解析结果
  console.log('[IpAddress]', {
    xForwardedFor: req.headers['x-forwarded-for'],
    xRealIp: req.headers['x-real-ip'],
    reqIp: req.ip,
    clientIp: req.clientIp,
    remoteAddress: req.socket?.remoteAddress,
    resolvedIp: ip,
    url: req.originalUrl || req.url,
    method: req.method,
  });
  return ip;
});
