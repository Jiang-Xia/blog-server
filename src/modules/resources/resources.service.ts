import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import { File } from './resources.entity';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import fs = require('fs');

async function delPath(path: string) {
  // console.log('start');
  try {
    if (!fs.existsSync(path)) {
      console.log('路径不存在');
      return '路径不存在';
    }
    // 异步执行
    fs.stat(path, (err, info) => {
      // console.log(info);
      if (info.isDirectory()) {
        //目录
        fs.readdir(path, (_err: any, data: any) => {
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              delPath(`${path}/${data[i]}`); //使用递归
              if (i == data.length - 1) {
                //删了目录里的内容就删掉这个目录
                delPath(`${path}`);
              }
            }
          } else {
            fs.rmdir(path, (_err) => {
              if (!_err) {
                // console.log('删除空目录');
              }
            }); //删除空目录
          }
        });
      } else if (info.isFile()) {
        fs.unlink(path, (_err) => {
          if (!_err) {
            // console.log('成功删除文件');
          }
        }); //删除文件
      }
    });
  } catch (error) {
    console.log(error);
  }
}

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
  ) {}
  // 调用第三方api 默认为一张
  async getImg(n = '1') {
    // console.log(n);
    const res = await axios.get(
      'http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=' + n,
    );
    // data才是返回的数据，res为axios实例
    // console.log(res.data);
    return res.data;
  }

  /* 资源上传 开始 */

  /**
   * 上传文件
   * @param file
   */
  async uploadFile(files: Express.Multer.File[]): Promise<File[]> {
    const newFiles = [];
    files.forEach((file: Express.Multer.File) => {
      const { originalname, destination, mimetype, size, filename } = file;
      const item: Partial<File> = {
        originalname,
        filename,
        type: mimetype,
        size,
        url: destination.replace('./public/', '/static/') + '/' + filename,
      };
      // 组装多个实例
      newFiles.push(this.fileRepository.create(item));
    });
    // console.log({ newFiles });
    // 批量保存文件信息
    return await this.fileRepository.save(newFiles);
  }

  /**
   * 获取所有文件
   */
  async findAll(queryParams): Promise<[File[], number]> {
    const query = this.fileRepository
      .createQueryBuilder('file')
      .orderBy('file.createAt', 'DESC');

    if (typeof queryParams === 'object') {
      const { page = 1, pageSize = 12, ...otherParams } = queryParams;
      query.skip((+page - 1) * +pageSize);
      query.take(+pageSize);

      if (otherParams) {
        Object.keys(otherParams).forEach((key) => {
          query
            .andWhere(`file.${key} LIKE :${key}`)
            .setParameter(`${key}`, `%${otherParams[key]}%`);
        });
      }
    }
    // const [list, total] = await query.getManyAndCount();
    // return {
    //   list: list,
    //   total,
    // };
    return await query.getManyAndCount();
  }

  /**
   * 获取指定文件
   * @param id
   */
  async findById(id): Promise<File> {
    return this.fileRepository.findOne(id);
  }

  async findByIds(ids): Promise<Array<File>> {
    return this.fileRepository.findByIds(ids);
  }

  /**
   * 删除文件
   * @param id
   */
  async deleteById(id) {
    const target = await this.fileRepository.findOne(id);
    // await this.oss.deleteFile(target.filename);
    const path: string = target.url.replace('/static/', './public/');
    delPath(path);
    return this.fileRepository.remove(target);
  }
}
