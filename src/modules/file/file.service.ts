import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { FileStore } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResourcesService } from '../resources/resources.service';
import { Cron } from '@nestjs/schedule';
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
    fs.unlink(folderPath, (err) => {
      // console.log(fs.readdirSync(folderPath));
      if (err) throw err;
      console.log('成功删除' + folderPath);
    });
  }
}

@Injectable()
export class FileService {
  constructor(
    private readonly resourcesService: ResourcesService,
    @InjectRepository(FileStore) private readonly fileRepository: Repository<FileStore>,
  ) {}
  private readonly logger = new Logger(FileService.name);
  /* 大文件切片上传 开始 */

  /**
   * 上传文件
   * @param file
   */
  async uploadBigFile(files: Express.Multer.File[]): Promise<Express.Multer.File[]> {
    // console.log('=============>', files);
    // const newFiles = [];
    // files.forEach((file: Express.Multer.File) => {
    //   const { originalname, destination, mimetype, size, filename } = file;
    //   const item: Partial<FileStore> = {
    //     originalname,
    //     filename,
    //     type: mimetype,
    //     size,
    //     url: destination.replace('./public/', '/static/') + '/' + filename,
    //   };
    // });
    // console.log({ files });
    // 批量保存文件信息
    // return await this.fileRepository.save(newFiles);
    await sleep(500);
    return files;
  }

  /**
   * 合并切片文件
   * @param body object
   */
  async mergeFile(body: any) {
    return await new Promise(async (resolve, reject) => {
      const { hash, fileName } = body;
      const basePath = `${Config.fileConfig.filePath}tempFolder`;
      const slicePath = `${basePath}/${hash}`;
      const folderSize = await getFolderSizeBin(basePath);
      const sliceSize = await getFolderSizeBin(basePath);
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
      const datePath = `${Config.fileConfig.filePath}${dayjs().format('YYYY-MM')}`;
      const fileNameTargetPath = `${datePath}/${hash}-${fileName}`;
      const writeStream = fs.createWriteStream(fileNameTargetPath);
      let allSliceNum = 0;
      sortedFiles.forEach((file, index) => {
        const filePath = path.join(slicePath, file);
        const readStream = fs.createReadStream(filePath);
        // https://www.nodeapp.cn/stream.html#stream_class_stream_readable
        readStream.pipe(writeStream, { end: false });
        readStream.on('end', () => {
          // 删除已合并的切片文件(单个删除) 每个事件独立的
          fs.unlinkSync(filePath);
          // console.log('读取切片完成：', filePath);
          allSliceNum++;
          if (allSliceNum === sortedFiles.length) {
            // 全部读取完写入
            // 完结束写入执行end()才会触发finish时间
            writeStream.end();
          }
        });
      });
      // 写入完成事件
      writeStream.on('finish', () => {
        console.log('Merge complete');
        const list: Partial<Express.Multer.File>[] = [];
        const fName = `${hash}-${fileName}`;
        const saveFile = {
          originalname: fileName,
          filename: fName,
          destination: datePath,
          mimetype: fileName.split('.').slice(-1)[0],
          size: sliceSize,
        };
        list.push(saveFile);
        this.resourcesService.uploadFile(list, '19f66b84-8841-4cf5-8932-d11b95947d2d');
        resolve(saveFile);
        // 移除切片文件夹
        deleteFolderRecursive(slicePath);
      });
    });
  }
  /**
   * 定时任务 定时删除切片临时文件
   * @param body object
   */
  // @Cron('5 * * * * *')
  // handleCron() {
  //   this.logger.debug('Called when the current second is 45');
  // }
  /* 大文件切片上传 结束 */
}
