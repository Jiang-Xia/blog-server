import './test';
// 需要全部导入
import * as os from 'os';
import jwtDecode from 'jwt-decode';
import { User } from 'src/modules/user/entity/user.entity';
import console from 'console';

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
export const getPagination = (total: number, pageSize: number, page: number) => {
  const pages = Math.ceil(total / pageSize);
  return {
    total,
    page,
    pageSize,
    pages,
  };
};
// 用的echart主题配色
const colors: string[] = [
  // westeros
  '#516b91',
  '#59c4e6',
  '#edafda',
  '#93b7e3',
  '#a5e7f0',
  '#cbb0e3',
  // wonderland
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
  // chalk
  '#fc97af',
  '#87f7cf',
  '#f7f494',
  '#72ccff',
  '#f7c5a0',
  '#d4a4eb',
  '#d2f5a6',
  '#76f2f2',
  // infographic
  '#c1232b',
  '#27727b',
  '#fcce10',
  '#e87c25',
  '#b5c334',
  '#fe8463',
  '#9bca63',
  '#fad860',
  '#f3a43b',
  '#60c0dd',
  '#d7504b',
  '#c6e579',
  '#f4e001',
  '#f0805a',
  '#26c0c0',
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

// 根据token获取yoghurt信息
export function getUserInfo(authorization = ''): User {
  if (!authorization) return;
  const token = authorization.replace('Bearer ', '');
  const user: any = jwtDecode(token);
  // console.log(uid);
  return user;
}

// 组装返回用户信息
export function setUserInfo(user: User, keys = ['nickname', 'id', 'avatar']) {
  const nUser = {};
  for (const key of keys) {
    nUser[key] = user[key];
  }
  return nUser;
}
