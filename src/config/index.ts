import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getLocalIP } from 'src/utils';
const env = process.env.NODE_ENV;
/*
 * mysql8修改密码  alter user  user() identified by 'jiang123!!';
 * https://blog.csdn.net/qq_42618394/article/details/103181778
 */
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: env === 'production' ? '42.192.145.236' : 'localhost',
  port: 3306,
  username: 'root',
  password: 'jiang123!!',
  database: 'myblog',
  // 此字段生产不能设置为true否则字段有改变时 影响生产数据或清空。
  synchronize: env === 'development',
};
const baseUrl =
  env === 'production'
    ? 'https://jiang-xia.top/x-blog'
    : 'http://' + (getLocalIP() || '127.0.0.1') + ':5000';
/* 服务配置 */
export const serveConfig = {
  prot: 5000,
  apiPath: 'api/v1',
  baseUrl: baseUrl,
  isDev: env === 'development',
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
