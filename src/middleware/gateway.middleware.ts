import { Request, Response, NextFunction, json } from 'express';
import { aesEncrypt, aesDecrypt } from 'src/utils/cryptogram.util';

/* 加密网关中间件 对请求数据进行解密，对响应报文进行加密 */
export function GatewagMiddleware(req: Request, res: Response, next: NextFunction) {
  // 判断url中是否为有encrypt，有则解密请求和加密响应，并且重写url
  try {
    const bool = req.url.includes('encrypt');
    if (bool) {
      // console.log('req.url', req.url);
      // console.log('req.body', req.body);

      /* 处理请求 解密body */
      if (req.body && Object.keys(req.body).length) {
        // console.log('req.body', req.body);
        const body = aesDecrypt(req.body.content);
        // console.log('aesDecrypt.body', body);
        req.body = JSON.parse(body);
      }
      req.url = req.url.replace('/encrypt', '');
      /* 处理响应 加密body */
      const oldSendFn = res.send;
      // @ts-expect-error 忽略ts错误
      res.send = (body: any) => {
        // console.log('res-body:', body);
        // 加密 body
        const encrypt = aesEncrypt(body);
        // console.log('encrypt-encrypt:', encrypt);
        const resBodyStr = JSON.stringify({ content: encrypt });
        // console.log('encrypt-resBody:', resBody);
        // !!! send方法需要传输字符串 传对象会报错
        oldSendFn.apply(res, [resBodyStr]);
      };
    }
  } catch (error) {
    // console.error(error);
  }
  next();
}
