import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Repository } from 'typeorm';
import { File } from './resources.entity';
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
  constructor(@InjectRepository(File) private readonly fileRepository: Repository<File>) {}
  // 调用第三方api 默认为一张
  async getImg(n = '1') {
    // console.log(n);
    const res = await axios.get('http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=' + n);
    // data才是返回的数据，res为axios实例
    // console.log(res.data);
    return res.data;
  }

  refresh_token =
    '122.99f93876aea369e6a87521176b52537c.YH4GCI-jr01jrsJlCMsiSNuXk23VUx90c3XFdSD.5KB7_Q';
  access_token =
    '121.61a970a03e677e8937e7538ba3c38dba.YDndQETVpnkUxiWkomfRiiufbMwQ4DPRztCtC8D.gg9B0Q';
  async baiDuTongJi(query) {
    const getData = async () => {
      const { url, ...otherParams /* 除了url其他组合成一个对象 */ } = query;
      const res = await axios.get(`https://openapi.baidu.com${url}`, {
        params: {
          ...otherParams,
          access_token: this.access_token,
        },
      });
      return res.data;
    };
    let data = await getData();
    // access_token 过期刷新token
    if (data.error_code === 110) {
      const res2 = await axios.get(`http://openapi.baidu.com/oauth/2.0/token`, {
        params: {
          grant_type: 'refresh_token',
          refresh_token: this.access_token,
          client_id: 'q7VG6K18Qk3zAbl4FTqsWFBvo85jPDef', // apikey
          client_secret: '6axk2HYSYuQde3tVoW0D3SClNbfIaLOi', // SecretKey
        },
      });
      this.access_token = res2.data.access_token;
      this.refresh_token = res2.data.refresh_token;
      data = await getData();
    }
    return data;
  }

  /* 资源上传 开始 */

  /**
   * 上传文件
   * @param file
   */
  async uploadFile(files: Express.Multer.File[], pid: string): Promise<File[]> {
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
      // 文件夹内部上传时直接赋值pid
      if (pid) {
        item.pid = pid;
      }
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
    const query = this.fileRepository.createQueryBuilder('file').orderBy('file.createAt', 'DESC');

    if (typeof queryParams === 'object') {
      const { page = 1, pageSize = 12, pid, isFolder, ...otherParams } = queryParams;
      query.skip((+page - 1) * +pageSize);
      query.take(+pageSize);
      if (pid) {
        query.andWhere(`file.pid = :pid`, { pid }); // 0为根目录，其他值为文件夹id
      }
      if (isFolder) {
        // 只返回文件夹
        query.andWhere(`file.isFolder = :isFolder`, { isFolder: true });
      }
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
  async deleteById(id: string) {
    const target: File = await this.fileRepository.findOne(id);
    // await this.oss.deleteFile(target.filename);
    const path: string = target.url.replace('/static/', './public/');
    delPath(path);

    // 递归删除
    const delCb = async (_target: File) => {
      // 是文件夹时
      if (_target.isFolder) {
        const targets = await this.fileRepository.find({ pid: id });
        // console.log(targets);
        targets.forEach((v: File) => {
          const p = v.url.replace('/static/', './public/');
          console.log(p);
          delPath(p);
          delCb(v);
        });
        this.fileRepository.remove(targets);
      }
    };
    delCb(target);

    return this.fileRepository.remove(target);
  }

  // 增加文件夹
  async addFolder(name: string) {
    const item: Partial<File> = {
      originalname: name,
      filename: name,
      type: '',
      size: 0,
      url: '',
      isFolder: true,
    };
    const newFile = this.fileRepository.create(item);
    return await this.fileRepository.save(newFile);
  }

  // 修改文件属性
  async updateField(field) {
    const { id } = field;
    delete field.id;
    const oldItem = await this.fileRepository.findOne(id);
    // merge - 将多个实体合并为一个实体。
    const updatedItem = await this.fileRepository.merge(oldItem, {
      ...field,
    });
    // console.log({ field, updatedItem });
    return this.fileRepository.save(updatedItem);
  }
}
