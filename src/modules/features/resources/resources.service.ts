import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { FileStore } from '../file/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { catchError, map } from 'rxjs/operators';
import { isIPv4 } from 'node:net';
import fs from 'fs';
// promise 文件操作
import fsPromises from 'fs/promises';
import { lastValueFrom } from 'rxjs';
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

// interface IReturn {
//   data: any;
// }
@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(FileStore) private readonly fileRepository: Repository<FileStore>,
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
  // const code = '5f8a8b97c134bcb21ceb113d88d9d43c';// 授权码
  // refresh_token 有效期为十年
  refresh_token =
    '122.03b3f1352cb6cc332eeed7d0b8bc5d71.YHruAHnpaEn4zzg4y6HLR0rTcL6XjIbUvFDVkMp.v6BL8A';
  async baiDuTongJi(query) {
    // 请求数据
    let data: any = await this.getDaiDuTongJiData(query);
    // token 过期 刷新token
    if (data.error_code === 110 || data.error_code === 111) {
      // console.log('data1', data);
      await this.refreshAccessToken();
      // 重新请求数据
      data = await this.getDaiDuTongJiData(query);
      // console.log('data2', data);
    }
    return data;
  }
  // 重置refresh_token和access_token
  // http://openapi.baidu.com/oauth/2.0/token?grant_type=authorization_code&code=ac717f026e12c8d4530ed62558379e26&client_id=q7VG6K18Qk3zAbl4FTqsWFBvo85jPDef&client_secret=6axk2HYSYuQde3tVoW0D3SClNbfIaLOi&redirect_uri=oob
  // 刷新 统计 access_token
  refreshAccessToken() {
    return new Promise((resolve, reject) => {
      try {
        // 121.bccb64029d73681aa7925f835c627d32.YmW85P2Wm79ZVQprBAQXokycI7Kgnx0jnmhbiYw.XsXpsw
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
              reject(e);
              throw new HttpException(`刷新access_token错误`, HttpStatus.INTERNAL_SERVER_ERROR);
            }),
          )
          .subscribe({
            next: async (data) => {
              try {
                const access_token = data.access_token || '';
                const jsonStr = JSON.stringify({ access_token });
                fs.writeFile('./public/data/tongji.json', jsonStr, 'utf8', (err) => {
                  console.log('写入成功 access_token');
                  resolve(data);
                });
              } catch (error) {}
            },
            error: (err) => {
              // {
              //   key: Object.keys(err),
              //   response: err.response,
              //   // 请求百度接口400时 response.data给的文本提示
              //   data: err.status.response.data,
              //   options: err.options,
              //   message: err.message,
              //   name: err.name,
              //   err: err,
              // }
              console.log('刷新token失败百度响应信息: ', 'err.status.response.data');
              // console.log('HTTP Error', err);
            },
          });
      } catch (error) {}
    });
  }
  // 获取统计数据
  getDaiDuTongJiData(query) {
    return new Promise(async (resolve) => {
      const { url, ...otherParams /* 除了url其他组合成一个对象 */ } = query;
      let access_token = '';
      try {
        const res = await fsPromises.readFile('./public/data/tongji.json', 'utf8');
        access_token = JSON.parse(res).access_token;
      } catch (error) {
        return;
      }
      console.log({ access_token });
      this.httpService
        .get(`https://openapi.baidu.com${url}`, {
          params: {
            ...otherParams,
            access_token: access_token,
          },
        })
        .pipe(map((res) => res.data))
        .subscribe({
          next: (data) => {
            resolve(data);
          },
          error: (error) => console.log('HTTP Error', HttpStatus.INTERNAL_SERVER_ERROR),
        });
    });
  }

  /* 资源上传 开始 */

  /**
   * 上传文件
   * @param file
   */
  async uploadFile(files: Partial<Express.Multer.File>[], pid: string): Promise<FileStore[]> {
    const newFiles: FileStore[] = [];
    files.forEach((file: Express.Multer.File) => {
      const { originalname, destination, mimetype, size, filename } = file;
      const item: Partial<FileStore> = {
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
  async findAll(queryParams: any): Promise<[FileStore[], number]> {
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
  async findById(id): Promise<FileStore> {
    return this.fileRepository.findOne({ where: { id } }) as unknown as FileStore;
  }

  async findByIds(ids): Promise<Array<FileStore>> {
    return this.fileRepository.findByIds(ids);
  }

  /**
   * 删除文件
   * @param id
   */
  async deleteById(id: string) {
    const target: FileStore | null = await this.fileRepository.findOne({ where: { id } });
    if (!target) {
      throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
    }
    // await this.oss.deleteFile(target.filename);
    const path: string = target.url.replace('/static/', './public/');
    delPath(path);

    // 递归删除
    const delCb = async (_target: FileStore) => {
      // 是文件夹时
      if (_target.isFolder) {
        const targets = await this.fileRepository.find({ where: { pid: id } });
        // console.log(targets);
        targets.forEach((v: FileStore) => {
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
    const item: Partial<FileStore> = {
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
    if (!oldItem) {
      throw new HttpException('文件不存在', HttpStatus.NOT_FOUND);
    }
    // merge - 将多个实体合并为一个实体。
    const updatedItem = await this.fileRepository.merge(oldItem, {
      ...field,
    });
    // console.log({ field, updatedItem });
    return this.fileRepository.save(updatedItem);
  }

  // 获取天气
  async getWeather(tip: string) {
    // const imgUrl =
    //   'https://cn.bing.com/th?id=OHR.ArraialdoCabo_ZH-CN6202620711_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp';
    const imgUrl = 'https://api.vvhan.com/api/ipCard?tip' + tip;
    try {
      const response = await lastValueFrom(
        this.httpService.get(imgUrl, { responseType: 'arraybuffer', timeout: 1500 }),
      );
      const imageBuffer = response.data;
      const imageBase64 = Buffer.from(imageBuffer).toString('base64');
      return `data:image/jpeg;base64,${imageBase64}`;
    } catch (error) {
      throw new HttpException('第三方接口错误：' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
