import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  // 重定向测试
  getAddress(type: string, res: any) {
    if (type === 'bing') {
      res.redirect('https://www.bing.com');
    } else if (type === 'google') {
      res.redirect('https://www.google.com');
    } else {
      res.redirect('https://www.baidu.com');
    }
  }
}
