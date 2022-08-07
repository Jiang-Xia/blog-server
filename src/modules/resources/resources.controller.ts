import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { ResourcesService } from './resources.service';
import { File } from './resources.entity';
import { FileInterceptor } from '@nestjs/platform-express';
// 文档
@ApiTags('资源模块')
@Controller('resources')
@UseGuards(RolesGuard)
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Get('daily-img')
  async getImg(@Query() query: any) {
    return await this.resourcesService.getImg(query.n);
  }

  /**
   * 上传文件
   * @param file
   */
  @ApiResponse({ status: 200, description: '上传文件', type: [File] })
  @Post('uploadFile')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fieldSize: 50 * 1024 * 1024,
      },
    }),
  )
  @UseGuards(JwtAuthGuard)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    /* !!! 这里的 file 已经是保存后的文件信息了，在此处做数据库处理，或者直接返回保存后的文件信息 */
    return this.resourcesService.uploadFile(file);
  }

  /**
   * 获取所有文件
   */
  @Get('file')
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
  @Delete('file:id')
  @Roles(['super', 'admin'])
  @UseGuards(JwtAuthGuard)
  deleteById(@Param('id') id) {
    return this.resourcesService.deleteById(id);
  }
}
