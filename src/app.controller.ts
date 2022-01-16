import { Controller, Get } from '@nestjs/common';
import { NestLogger } from 'nest-logs';
import { AppService } from './app.service';
@NestLogger()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
