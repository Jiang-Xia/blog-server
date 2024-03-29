// src/interception/transform.interception.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { Config } from '../config';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private reqLogger = new Logger('HTTP Request');
  private resLogger = new Logger('HTTP Response');
  openMsglog = Config.serveConfig.isDev;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = uuidv4().replace(/-/g, '');
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const { method, originalUrl, body, params, query } = req;
    const startTime = Date.now();
    return next.handle().pipe(
      tap(() => {
        // tab 副作用函数不改变数据流
        if (!this.openMsglog) {
          return;
        }
        const endTime = Date.now();
        const { statusCode } = res;
        const contentLength = res.get('content-length');
        const duration = endTime - startTime;
        this.reqLogger.log(
          `[${requestId}] ${method} ${originalUrl} ${statusCode} ${duration}ms - ${contentLength || 0}b Start`,
        );
        this.reqLogger.debug(`Request body: ${JSON.stringify(body)}`);
        this.reqLogger.debug(`Request params: ${JSON.stringify(params)}`);
        this.reqLogger.debug(`Request query: ${JSON.stringify(query)}`);
      }),
      map((data) => {
        // map 重包装改变数据流
        let message = 'success';
        if (data?.message) {
          message = data.message;
          delete data.message;
          // data为空对象时返回Boolean true
          data = !!!Object.keys(data).length ? true : data;
        }
        return {
          code: 200,
          data,
          message,
        };
      }),
      tap((data) => {
        if (!this.openMsglog) {
          return;
        }
        this.resLogger.debug(`Response body: ${JSON.stringify(data)}`);
        const endTime = Date.now();
        const { statusCode } = res;
        const contentLength = res.get('content-length');
        const duration = endTime - startTime;
        this.resLogger.log(
          `[${requestId}] ${method} ${originalUrl} ${statusCode} ${duration}ms - ${contentLength || 0}b End`,
        );
      }),
    );
  }
}
