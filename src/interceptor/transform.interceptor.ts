// src/interception/transform.interception.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Logger } from '@nestjs/common';
import { Config } from '../config';
import { v4 as uuidv4 } from 'uuid';
import { maskForLog } from '../utils/log-mask.util';

// 不走公共拦截器的接口
const whiteControllerList: Array<string> = ['stream'];
@Injectable()
export class TransformInterceptor implements NestInterceptor {
  private reqLogger = new Logger('HTTP Request');
  private resLogger = new Logger('HTTP Response');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const openMsgLog = Config.appConfig.openMsgLog;
    const closeMsgBodyLog = Config.appConfig.closeMsgBodyLog;
    const requestId = uuidv4().replace(/-/g, '');
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();
    const { method, url, body, header, params, query } = req;
    const parsedUrl = new URL(url, `http://${header.host}`);
    const pathname = parsedUrl.pathname;
    const startTime = Date.now();
    // 不走公共处理
    if (whiteControllerList.some((str) => url.includes(str))) {
      // timeout(120000)
      return next.handle().pipe();
    } else {
      return next.handle().pipe(
        tap(() => {
          // tab 副作用函数不改变数据流
          if (!openMsgLog) {
            return;
          }
          const endTime = Date.now();
          const { statusCode } = res;
          const contentLength = res.get('content-length');
          const duration = endTime - startTime;
          this.reqLogger.log(
            `[${requestId}] ${method} ${pathname} ${statusCode} ${duration}ms - ${contentLength || 0}b Start`,
          );
          this.reqLogger.debug(`Request body: ${JSON.stringify(maskForLog(body))}`);
          this.reqLogger.debug(`Request params: ${JSON.stringify(maskForLog(params))}`);
          this.reqLogger.debug(`Request query: ${JSON.stringify(maskForLog(query))}`);
        }),
        map((data) => {
          // map 重包装改变数据流
          let message = 'success';
          if (data?.message) {
            message = data.message;
            delete data.message;
            // data为空对象时返回Boolean true
            data = !Object.keys(data).length ? true : data;
          }
          return {
            code: 200,
            bizCode: 200,
            data,
            message,
          };
        }),
        tap((data) => {
          if (!openMsgLog) {
            return;
          }
          if (!closeMsgBodyLog) {
            this.resLogger.debug(`Response body: ${JSON.stringify(maskForLog(data))}`);
          }
          const endTime = Date.now();
          const { statusCode } = res;
          const contentLength = res.get('content-length');
          const duration = endTime - startTime;
          this.resLogger.log(
            `[${requestId}] ${method} ${pathname} ${statusCode} ${duration}ms - ${contentLength || 0}b End`,
          );
        }),
      );
    }
  }
}
