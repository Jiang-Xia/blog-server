import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { ResourcesService } from './resources.service';
import { File } from './resources.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { IpAddress } from 'src/utils/common';
// 文档
@ApiTags('资源模块')
@Controller('resources')
@UseGuards(RolesGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  // 代理bing壁纸
  @Get('daily-img')
  getImg(@Query() query: any) {
    return this.resourcesService.getImg(query.n);
  }
  // 代理百度统计
  @Get('baidutongji')
  async baiDuTongJi(@Query() query: any) {
    return await this.resourcesService.baiDuTongJi(query);
  }
  @Get('weather')
  async weather(@IpAddress() ip: string) {
    return await this.resourcesService.getWeather(ip);
  }

  /**
   * 上传文件
   * @param file
   */
  @ApiResponse({ status: 200, description: '上传文件', type: [File] })
  @Post('uploadFile')
  // {
  //   limits: {
  //     fieldSize: 50 * 1024 * 1024,
  //   },
  // }
  @UseInterceptors(
    /* 一个fileContents里面可以有多个文件对象，前端使用formData同一个fileContents传多个值 */
    FileFieldsInterceptor([
      { name: 'fileContents', maxCount: 10 /* 每个字段可接受的最大文件数 */ },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  uploadFile(
    @UploadedFiles()
    files: {
      fileContents?: Express.Multer.File[];
    },
    @Body('pid') pid: string,
  ) {
    // ! 这里的 file 已经是保存后的文件信息了，在此处做数据库处理，或者直接返回保存后的文件信息
    // console.log(files.fileContents);
    return this.resourcesService.uploadFile(files.fileContents, pid);
  }

  /**
   * 获取所有文件
   */
  @Get('files')
  findAll(@Query() queryParam) {
    return this.resourcesService.findAll(queryParam);
  }

  /**
   * 获取指定文件
   * @param id
   */
  @Get('file:id')
  findById(@Param('id') id) {
    return this.resourcesService.findById(id);
  }

  /**
   * 删除文件
   * @param id
   */
  @Delete('file')
  @Roles(['super', 'admin'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Query('id') id) {
    return this.resourcesService.deleteById(id);
  }

  // 增加文件夹
  @Post('folder')
  async addFolder(@Body('name') name: string) {
    return await this.resourcesService.addFolder(name);
  }

  @Patch('file')
  updateById(@Body() file: any) {
    return this.resourcesService.updateField(file);
  }
}
