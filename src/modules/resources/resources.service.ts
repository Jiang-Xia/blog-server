import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { File } from './resources.entity';
import { InjectRepository } from '@nestjs/typeorm';
import fs = require('fs');
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { rejects } from 'assert';
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

interface IReturn {
  data: any;
}
@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(File) private readonly fileRepository: Repository<File>,
    private readonly httpService: HttpService,
  ) {}
  getImg(n = '1') {
    const res: any = this.httpService
      .get('http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=' + n)
      .pipe(map((res) => res.data));
    // console.log(res); // 这里直接打印不出来数据格式的，都是映射函数,需要用subscribe观察
    // res.subscribe((val) => console.log(val));// 订阅观察了，就可以打印出来
    return res;
  }
  refresh_token =
    '122.99f93876aea369e6a87521176b52537c.YH4GCI-jr01jrsJlCMsiSNuXk23VUx90c3XFdSD.5KB7_Q';
  access_token =
    '121.316374f417b9d466bf0879e19214ec80.YmGWuMyPrGqqJdMoW11NcqX1C0BEgHMYsglXGJY.fR9hdA';

  async baiDuTongJi(query) {
    // 请求数据
    let data: any = await this.getDaiDuTongJiData(query);
    // console.log('data1', data);
    // token 过期 刷新token
    if (data.error_code === 110 || data.error_code === 111) {
      await this.refreshAccessToken();
      // 重新请求数据
      data = await this.getDaiDuTongJiData(query);
      // console.log('data2', data);
    }
    return data;
  }
  // 刷新 统计 access_token
  refreshAccessToken() {
    return new Promise((resolve) => {
      this.httpService
        .get(`http://openapi.baidu.com/oauth/2.0/token`, {
          params: {
            grant_type: 'refresh_token',
            refresh_token: this.refresh_token,
            client_id: 'q7VG6K18Qk3zAbl4FTqsWFBvo85jPDef', // apikey
            client_secret: '6axk2HYSYuQde3tVoW0D3SClNbfIaLOi', // SecretKey
          },
        })
        .pipe(
          map((res) => res.data),
          catchError((e) => {
            throw new HttpException(`刷新access_token错误`, 400);
          }),
        )
        .subscribe((data) => {
          this.access_token = data.access_token;
          this.refresh_token = data.refresh_token;
          resolve(data);
        });
    });
  }
  // 获取统计数据
  getDaiDuTongJiData(query) {
    return new Promise((resolve) => {
      const { url, ...otherParams /* 除了url其他组合成一个对象 */ } = query;
      this.httpService
        .get(`https://openapi.baidu.com${url}`, {
          params: {
            ...otherParams,
            access_token: this.access_token,
          },
        })
        .pipe(map((res) => res.data))
        .subscribe((data) => resolve(data));
    });
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
    return this.fileRepository.findOne({ where: { id } });
  }

  async findByIds(ids): Promise<Array<File>> {
    return this.fileRepository.findByIds(ids);
  }

  /**
   * 删除文件
   * @param id
   */
  async deleteById(id: string) {
    const target: File = await this.fileRepository.findOne({ where: { id } });
    // await this.oss.deleteFile(target.filename);
    const path: string = target.url.replace('/static/', './public/');
    delPath(path);

    // 递归删除
    const delCb = async (_target: File) => {
      // 是文件夹时
      if (_target.isFolder) {
        const targets = await this.fileRepository.find({ where: { pid: id } });
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
    const oldItem = await this.fileRepository.findOne({ where: { id } });
    // merge - 将多个实体合并为一个实体。
    const updatedItem = await this.fileRepository.merge(oldItem, {
      ...field,
    });
    // console.log({ field, updatedItem });
    return this.fileRepository.save(updatedItem);
  }
}
