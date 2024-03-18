import { Controller, Get, Query, Response } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('redirect')
  getAddress(@Query('type') type: string, @Response() res: any) {
    this.appService.getAddress(type, res);
  }
}
