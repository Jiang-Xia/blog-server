import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Repository } from 'typeorm';
import { FileStore } from '../file/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs/operators';
import fs from 'fs';
// promise 文件操作
import fsPromises from 'fs/promises';
import { lastValueFrom } from 'rxjs';
import path from 'path';
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
  private readonly tongjiTokenFilePath = path.resolve('./public/data/tongji.json');
  private tongjiAccessTokenCache: string | null = null;
  // 先使用写死配置，后续再改为环境变量
  private readonly tongjiRefreshToken =
    '122.de62b2355693d7aeea3a428a1de6c044.YBE6FUJ6wvYfHSvaFqTA3UDQNZOT-olBm4qtnSS.E4X_jA';
  private readonly tongjiClientId = 'q7VG6K18Qk3zAbl4FTqsWFBvo85jPDef';
  private readonly tongjiClientSecret = '6axk2HYSYuQde3tVoW0D3SClNbfIaLOi';

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
  async baiDuTongJi(query: Record<string, any>) {
    const normalizedQuery = this.normalizeTongJiQuery(query);
    // 请求数据
    let data: any = await this.getDaiDuTongJiData(normalizedQuery);
    // token 过期 刷新token
    if (this.isBaiduTokenExpired(data)) {
      await this.refreshAccessToken();
      // 重新请求数据
      data = await this.getDaiDuTongJiData(normalizedQuery);
    }
    return data;
  }
  // 重置refresh_token和access_token
  // 获取授权码code
  // http://openapi.baidu.com/oauth/2.0/authorize?response_type=code&client_id=q7VG6K18Qk3zAbl4FTqsWFBvo85jPDef&redirect_uri=oob&scope=basic&display=popup
  // 刷新 统计 access_token
  async refreshAccessToken() {
    try {
      // 8ed7cd92ed3c35a2396bb9415c616b48
      console.log('[baidutongji][refreshAccessToken] request params:', {
        grant_type: 'refresh_token',
        refresh_token: `${this.tongjiRefreshToken.slice(0, 10)}***`,
        client_id: this.tongjiClientId,
        client_secret: `${this.tongjiClientSecret.slice(0, 6)}***`,
      });
      const response = await lastValueFrom(
        this.httpService
          .get(`http://openapi.baidu.com/oauth/2.0/token`, {
            params: {
              grant_type: 'refresh_token',
              refresh_token: this.tongjiRefreshToken,
              client_id: this.tongjiClientId,
              client_secret: this.tongjiClientSecret,
            },
          })
          .pipe(map((res) => res.data)),
      );
      const accessToken = response?.access_token;
      if (!accessToken) {
        throw new HttpException('百度返回的 access_token 为空', HttpStatus.BAD_GATEWAY);
      }
      this.tongjiAccessTokenCache = accessToken;
      await fsPromises.mkdir(path.dirname(this.tongjiTokenFilePath), { recursive: true });
      await fsPromises.writeFile(
        this.tongjiTokenFilePath,
        JSON.stringify({ access_token: accessToken }),
        'utf8',
      );
      return response;
    } catch (error: any) {
      if (error instanceof HttpException) {
        throw error;
      }
      const baiduError =
        error?.response?.data?.error_description ||
        error?.response?.data?.error ||
        error?.message ||
        'unknown error';
      throw new HttpException(
        `刷新百度统计 access_token 失败: ${baiduError}`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
  // 获取统计数据
  async getDaiDuTongJiData(query: Record<string, any>) {
    const { url, ...otherParams /* 除了url其他组合成一个对象 */ } = query;
    const accessToken = await this.readTongjiAccessToken();
    console.log('[baidutongji][getDaiDuTongJiData] request params:', {
      url,
      ...otherParams,
      access_token: `${accessToken.slice(0, 10)}***`,
    });
    try {
      const response = await lastValueFrom(
        this.httpService
          .get(`https://openapi.baidu.com${url}`, {
            params: {
              ...otherParams,
              access_token: accessToken,
            },
          })
          .pipe(map((res) => res.data)),
      );
      return response;
    } catch (error: any) {
      const baiduError =
        error?.response?.data?.message ||
        error?.response?.data?.error_description ||
        error?.response?.data?.error ||
        error?.message ||
        'unknown error';
      throw new HttpException(`百度统计接口调用失败: ${baiduError}`, HttpStatus.BAD_GATEWAY);
    }
  }

  private normalizeTongJiQuery(query: Record<string, any>) {
    const { url, ...otherParams } = query || {};
    if (!url || typeof url !== 'string') {
      throw new HttpException('缺少百度统计请求参数 url', HttpStatus.BAD_REQUEST);
    }
    if (!url.startsWith('/rest/2.0/tongji/')) {
      throw new HttpException('百度统计请求 url 不合法', HttpStatus.BAD_REQUEST);
    }
    return { url, ...otherParams };
  }

  private async readTongjiAccessToken() {
    if (this.tongjiAccessTokenCache) {
      return this.tongjiAccessTokenCache;
    }
    try {
      const res = await fsPromises.readFile(this.tongjiTokenFilePath, 'utf8');
      const accessToken = JSON.parse(res).access_token;
      if (!accessToken) {
        throw new Error('empty access token');
      }
      this.tongjiAccessTokenCache = accessToken;
      return accessToken;
    } catch {
      throw new HttpException(
        '百度统计 access_token 不存在，请先初始化 tongji.json 或触发 token 刷新',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private isBaiduTokenExpired(data: any) {
    return !!data && (data.error_code === 110 || data.error_code === 111);
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
