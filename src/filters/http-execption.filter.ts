/*
 * @Author: 酱
 * @LastEditors: 酱
 * @Date: 2021-11-16 11:53:16
 * @LastEditTime: 2021-12-01 11:35:38
 * @Description:
 * @FilePath: \blog-server\src\filters\http-execption.filter.ts
 */
// src/filters/http-execption.filters.ts

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { execPath } from 'process';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

    const exceptionResponse: any = exception.getResponse();
    let validatorMessage = exceptionResponse;
    if (typeof validatorMessage === 'object') {
      validatorMessage = exceptionResponse.message;
    }
    response.status(status).json({
      code: status,
      message: validatorMessage || message,
    });
  }
}
