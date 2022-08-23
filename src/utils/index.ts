<<<<<<< HEAD
import './test';
// 需要全部导入
import * as os from 'os';
import jwtDecode from 'jwt-decode';
import { User } from 'src/modules/user/entity/user.entity';

export default class utils {
  getPagination;
}
// src/utils/index.ts

/**
 * 计算分页
 * @param total
 * @param pageSize
 * @param page
 * @returns
 */
export const getPagination = (
  total: number,
  pageSize: number,
  page: number,
) => {
  const pages = Math.ceil(total / pageSize);
  return {
    total,
    page,
    pageSize,
    pages,
  };
};

const colors: string[] = [
  '#4ea397',
  '#22c3aa',
  '#7bd9a5',
  '#d0648a',
  '#f58db2',
  '#f2b3c9',
  // dark
  '#dd6b66',
  '#759aa0',
  '#e69d87',
  '#8dc1a9',
  '#ea7e53',
  '#73a373',
  '#73b9bc',
  '#7289ab',
  '#91ca8c',
  '#f49f42',
];
// 随机获取一种颜色
export const getRandomClor = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

// 获取本机ip
export function getLocalIP() {
  const osType = os.type(); //系统类型
  const netInfo = os.networkInterfaces(); //网络信息
  let ip = '';
  if (osType === 'Windows_NT') {
    for (const dev in netInfo) {
      //win7的网络信息中显示为本地连接，win10显示为以太网
      if (dev === '本地连接' || dev === '以太网') {
        for (let j = 0; j < netInfo[dev].length; j++) {
          if (netInfo[dev][j].family === 'IPv4') {
            ip = netInfo[dev][j].address;
            break;
          }
        }
      }
    }
  } else if (osType === 'Linux') {
    ip = netInfo.eth0[0].address;
  }
  return ip;
}

// 获取用户uid
export function getUid(authorization = '') {
  if (!authorization) return;
  const token = authorization.replace('Bearer ', '');
  const user: any = jwtDecode(token);
  const uid = user.id;
  // console.log(uid);
  return uid;
}
