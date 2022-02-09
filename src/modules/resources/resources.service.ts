import { Get, Injectable } from '@nestjs/common';
import axios from 'axios';
@Injectable()
// 没有使用到数据库实例
export class ResourcesService {
  constructor() {
    // null
  }
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
}
