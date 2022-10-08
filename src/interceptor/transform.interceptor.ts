// src/interception/transform.interception.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
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
    );
  }
}
