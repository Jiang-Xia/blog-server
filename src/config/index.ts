import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getLocalIP } from 'src/utils';
const env = process.env.NODE_ENV;
/*
 * mysql8修改密码  alter user  user() identified by 'jiang123!!';
 * https://blog.csdn.net/qq_42618394/article/details/103181778
 */

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  // host: env === 'production' ? '42.192.145.236' : 'localhost',
  host: '42.192.145.236',
  port: 3306,
  username: 'root',
  password: 'jiang123!!',
  database: 'myblog',
};
/* 服务配置 */
export const serveConfig = {
  ip: getLocalIP() || '127.0.0.1',
  prot: 5000,
  apiPath: 'api/v1',
  isDev: env !== 'production',
};

/* 初始化账户 */
export const accountConfig = {
  mobile: '18888888888',
  password: 'super',
  role: 'super',
  nickname: 'super',
  passwordRepeat: 'super',
};

/* 文件存储位置 */
export const fileConfig = {
  // filePath:env === 'production' ? '/blog/static/uploads/' : './public/uploads/',
  filePath: './public/uploads/', // 直接使用本nestjs服务做静态资源服务
};
