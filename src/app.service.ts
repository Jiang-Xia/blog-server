import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AppService {
  private config = ConfigService;
  getHello(): string {
    console.log(this.config);
    return 'Hello World!';
  }
  // 重定向测试
  getAddress(type: string, res: any) {
    if (type === 'bing') {
      res.redirect('https://www.bing.com');
    } else if (type === 'google') {
      res.redirect('https://www.google.com');
    } else if (type === 'html') {
      setTimeout(() => {
        const htmlContent = `
          <html>
            <head>
              <title>Sample HTML Document</title>
            </head>
            <body>
              <h1>Hello, NestJS!</h1>
              <p>This is a sample HTML document returned by NestJS.</p>
            </body>
          </html>
        `;
        res.setHeader('Content-Type', 'text/html');
        res.send(htmlContent);
      }, 1500);
    } else {
      res.redirect('https://www.baidu.com');
    }
  }
}
