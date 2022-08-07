import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import { File } from './resources.entity';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
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
  async uploadFile(file: Express.Multer.File): Promise<File> {
    const { originalname, destination, mimetype, path, size, filename } = file;
    // console.log(file);
    const newFile = await this.fileRepository.create({
      originalname,
      filename,
      type: mimetype,
      size,
      url: destination.replace('./public', '/static/') + filename,
    });
    return await this.fileRepository.save(newFile);
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
    return this.fileRepository.remove(target);
  }
}
