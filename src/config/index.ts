import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getLocalIP } from 'src/utils';
/*
 * mysql8修改密码  alter user  user() identified by 'jiang123!!';
 * https://blog.csdn.net/qq_42618394/article/details/103181778
 */
type ConfigInterface = {
  databaseConfig: any;
  serveConfig: any;
  accountConfig: any;
  fileConfig: any;
};
export let Config: ConfigInterface = {
  databaseConfig: {},
  serveConfig: {},
  accountConfig: {},
  fileConfig: {},
};
export const InitConfig = () => {
  const env = process.env.NODE_ENV;
  const databaseConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: env === 'production' ? '127.0.0.1' : 'localhost',
    port: 3306,
    username: 'root',
    password: 'jiang123!!',
    database: 'myblog',
    // 此字段生产不能设置为true否则字段有改变时 影响生产数据或清空。
    synchronize: true, //env === 'development',
  };
  /* 服务配置 */
  const serveConfig = {
    prot: 5000,
    apiPath: 'api/v1',
    baseUrl:
      env === 'production'
        ? 'https://jiang-xia.top/x-blog'
        : 'http://' + (getLocalIP() || '127.0.0.1') + ':5000',
    isDev: env === 'development',
  };
  /* 初始化账户 */
  const accountConfig = {
    mobile: '18888888888',
    password: 'super',
    role: 'super',
    nickname: 'super',
    passwordRepeat: 'super',
  };
  /* 文件存储位置 */
  const fileConfig = {
    // filePath:env === 'production' ? '/blog/static/uploads/' : './public/uploads/',
    filePath: './public/uploads/', // 直接使用本nestjs服务做静态资源服务
  };
  Config = {
    databaseConfig,
    serveConfig,
    accountConfig,
    fileConfig,
  };
  console.warn(Config);
  return Config;
};
export default () => {
  return Config;
};
