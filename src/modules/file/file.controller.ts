import { Controller, Post, Body, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { MyFile } from './file.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
// 文档
@ApiTags('文件模块')
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}
  /**
   * 上传大文件
   * @param file
   */
  @ApiResponse({ status: 200, description: '上传大文件', type: [MyFile] })
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

  @ApiResponse({ status: 200, description: '合并文件', type: MyFile })
  @Post('uploadBigFile/merge')
  mergeFile(@Body() body: any) {
    return this.fileService.mergeFile(body);
  }
}
