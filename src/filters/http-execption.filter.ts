/*
 * @Author: 酱
 * @LastEditors: 酱
 * @Date: 2021-11-16 11:53:16
 * @LastEditTime: 2022-01-03 22:31:38
 * @Description:
 * @FilePath: \blog-server\src\filters\http-execption.filter.ts
 */
// src/filters/http-execption.filters.ts

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Logger } from '@nestjs/common';
import { maskForLog } from '../utils/log-mask.util';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('HTTP Exception');

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;
    const exceptionResponse: any = exception.getResponse();
    let validatorMessage = exceptionResponse;
    let bizCode: number | string = status;
    if (typeof validatorMessage === 'object' && validatorMessage !== null) {
      // 多条message
      // console.log('exceptionResponse:', exceptionResponse);
      validatorMessage = exceptionResponse.message;
      if (validatorMessage instanceof Array) {
        validatorMessage = validatorMessage[0];
      }
      if (
        typeof exceptionResponse.bizCode === 'number' ||
        typeof exceptionResponse.bizCode === 'string'
      ) {
        bizCode = exceptionResponse.bizCode;
      }
    }

    this.logger.error(
      `HTTP ${request.method} ${request.originalUrl || request.url} ${status} - ${exception.name}`,
      JSON.stringify(
        maskForLog({
          body: request.body,
          params: request.params,
          query: request.query,
          exceptionResponse,
        }),
      ),
    );

    response.status(status).json({
      code: status,
      bizCode,
      message: validatorMessage || message,
    });
  }
}
