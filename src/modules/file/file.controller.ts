import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileStore } from './file.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../auth/roles.guard';

// 文档
@ApiTags('文件模块')
@Controller('file')
@UseGuards(RolesGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}
  /**
   * 上传大文件
   * @param file
   */
  @ApiResponse({ status: 200, description: '上传大文件', type: [FileStore] })
  @ApiBody({ type: FileStore })
  @Post('uploadBigFile')
  @UseInterceptors(
    /* 一个fileContents里面可以有多个文件对象，前端使用formData同一个fileContents传多个值 */
    FileFieldsInterceptor([
      { name: 'fileContents', maxCount: 10 /* 每个字段可接受的最大文件数 */ },
    ]),
  )
  uploadBigFile(
    @UploadedFiles()
    files: {
      fileContents?: Express.Multer.File[];
    },
  ) {
    // ! 这里的 file 已经是保存后的文件信息了，在此处做数据库处理，或者直接返回保存后的文件信息
    return this.fileService.uploadBigFile(files.fileContents);
  }

  @ApiResponse({ status: 200, description: '合并文件', type: FileStore })
  @ApiBody({ type: Object })
  @Post('uploadBigFile/merge')
  mergeFile(@Body() body: any) {
    return this.fileService.mergeFile(body);
  }

  @ApiResponse({ status: 200, description: '检查已上传的切片', type: FileStore })
  @ApiBody({ type: Object })
  @Get('uploadBigFile/checkFile')
  checkFile(@Query() query: any) {
    return this.fileService.checkFile(query);
  }
}
