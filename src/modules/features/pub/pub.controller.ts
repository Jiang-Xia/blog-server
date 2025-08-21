import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PubService } from './pub.service';
import OpenAI from 'openai';
// 文档
@ApiTags('公共模块')
@Controller('pub')
// 权限
export class PubController {
  constructor(private readonly pubService: PubService) {}

  @Post('ai-stream')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  async aiStream(@Body() body: any, @Query() query: any, @Response() res) {
    // console.log('body:', body);
    const openai = new OpenAI({
      baseURL: body.baseURL,
      apiKey: body.apiKey,
    });
    // !必需设置为200 不然前端响应一次之后就会关闭连接了
    res.status(200);
    const messages: any = body.messages || { role: 'user', content: query.content };
    const model = body.model || 'deepseek-reasoner';
    const stream = body.stream || true;
    if (model === 'deepseek-reasoner' || model === 'deepseek-r1:1.5b') {
      try {
        const response: any = await openai.chat.completions.create({
          messages,
          model,
          stream,
        });
        // console.log('response:', response);
        for await (const chunk of response) {
          // console.log('chunk:', JSON.stringify(chunk));
          if (chunk.choices[0].delta.reasoning_content) {
            // console.log('reasoning_content:', chunk.choices[0].delta.reasoning_content);
            // ! \n\n结尾是必需的
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          } else {
            // console.log('content:', chunk.choices[0].delta.content);
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);
          }
        }
        res.write(`data: [DONE]\n\n`);
      } catch (error) {
        let msg: string = '';
        if (error instanceof OpenAI.APIError) {
          msg = `API Error: ${error.message}`;
        } else if (error.constructor.name === 'TimeoutError') {
          msg = '请求超时，请检查网络或增加超时时间';
          throw new Error('请求超时，请检查网络或增加超时时间');
        } else {
          msg = '未知错误';
        }
        res.write(`data: [DONE]\n\n`);
        throw new HttpException(msg, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    } else if (model === 'deepseek-chat') {
      const response: any = await openai.chat.completions.create({
        messages,
        model,
        stream,
      });
      if (stream) {
        for await (const chunk of response) {
          res.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }
        res.write(`data: [DONE]\n\n`);
      } else {
        res.write(`data: ${JSON.stringify(response)}\n\n`);
        res.write(`data: [DONE]\n\n`);
      }
    }
    res.on('close', () => {
      // console.log('close connection!');
      res.end();
    });
  }

  // @Get('stream')
  @Post('stream')
  @Header('Content-Type', 'text/event-stream')
  @Header('Cache-Control', 'no-cache')
  @Header('Connection', 'keep-alive')
  getStream(@Response() res: any) {
    // res.setHeader('Content-Type', 'text/event-stream');
    // res.setHeader('Cache-Control', 'no-cache');
    // res.setHeader('Connection', 'keep-alive');
    const message = 'Hello, how are you today?'; // 要打字的消息
    let index = 0;
    // 每隔 100ms 发送一个字符
    const interval = setInterval(() => {
      if (index < message.length) {
        res.write(`data: ${message.substring(0, index + 1)}\n\n`);
        index++;
      } else {
        clearInterval(interval);
        res.write('data: [DONE]\n\n'); // 完成后发送 DONE 标识
      }
    }, 100); // 控制打字速度，每 100ms 发送一个字符
    res.status(200);
    res.on('close', () => {
      console.log(index, 'index');
      clearInterval(interval);
      res.end();
    });
    // setInterval(() => {
    //   res.write('data: Hello World \n\n'); // 完成后发送 DONE 标识
    // }, 100);
  }
}
