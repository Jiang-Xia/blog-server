import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { MyFile } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, map } from 'rxjs/operators';
import { isIPv4 } from 'net';
import fs = require('fs');
// promise 文件操作
import fsPromises = require('fs/promises');

// interface IReturn {
//   data: any;
// }
@Injectable()
export class FileService {
  constructor(
    @InjectRepository(MyFile) private readonly fileRepository: Repository<MyFile>,
    private readonly httpService: HttpService,
  ) {}
  /* 大文件切片上传 开始 */

  /**
   * 上传文件
   * @param file
   */
  async uploadBigFile(files: Express.Multer.File[]): Promise<MyFile[]> {
    // console.log('=============>', files);
    const newFiles = [];
    // files.forEach((file: Express.Multer.File) => {
    //   const { originalname, destination, mimetype, size, filename } = file;
    //   const item: Partial<File> = {
    //     originalname,
    //     filename,
    //     type: mimetype,
    //     size,
    //     url: destination.replace('./public/', '/static/') + '/' + filename,
    //   };
    //   // 组装多个实例
    //   newFiles.push(this.fileRepository.create(item));
    // });
    // console.log({ newFiles });
    // 批量保存文件信息
    return await this.fileRepository.save(newFiles);
  }
  /* 大文件切片上传 结束 */
}
