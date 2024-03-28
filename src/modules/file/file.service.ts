import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { MyFile } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Config } from '../../config';
import { getFolderSizeBin } from 'go-get-folder-size';
import * as dayjs from 'dayjs';
import * as fs from 'fs';
import * as path from 'path';

// promise 文件操作

const sleep = (time: number = 2000): any => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(time);
    }, time);
  });
};
// 删除文件夹
function deleteFolderRecursive(folderPath: string) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        // 如果是文件夹，则递归删除
        deleteFolderRecursive(curPath);
      } else {
        // 如果是文件，则直接删除
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath); // 删除空文件夹
  }
}
@Injectable()
export class FileService {
  constructor(@InjectRepository(MyFile) private readonly fileRepository: Repository<MyFile>) {}
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
    // return await this.fileRepository.save(newFiles);
    return await sleep(500);
  }

  async mergeFile(body: any) {
    return await new Promise(async (resolve, reject) => {
      const { hash, fileName } = body;
      const basePath = `${Config.fileConfig.filePath}tempFolder`;
      const slicePath = `${basePath}/${hash}`;

      const folderSize = await getFolderSizeBin(basePath);
      // console.log('folderSize=============>', folderSize);
      // 4194304 4M 524288000 500M 2147483648 2G
      if (folderSize > 524288000) {
        // promise 响应错误
        reject(new HttpException('内存不足，禁止上传', HttpStatus.INTERNAL_SERVER_ERROR));
      }
      const files = fs.readdirSync(slicePath);
      const sortedFiles = files.sort((a, b) => {
        const [aIndex, bIndex] = [parseInt(a.split('-')[1]), parseInt(b.split('-')[1])];
        return aIndex - bIndex;
      });
      // console.log('sortedFiles=============>', sortedFiles, fileName);
      // 保存合成文件路径
      const fileNameTargetPath = `${Config.fileConfig.filePath}${dayjs().format('YYYY-MM')}/${fileName}`;
      const writeStream = fs.createWriteStream(fileNameTargetPath);

      sortedFiles.forEach((file, index) => {
        const filePath = path.join(slicePath, file);
        const readStream = fs.createReadStream(filePath);
        readStream.pipe(writeStream, { end: false });
        readStream.on('end', () => {
          // 删除已合并的切片文件(单个删除) 每个事件独立的
          fs.unlinkSync(filePath);
        });
      });
      resolve(writeStream.path);
      writeStream.on('finish', () => {
        console.log('Merge complete');
        // todo 进行数据库存储操作
      });
    });
  }
  /* 大文件切片上传 结束 */
}
