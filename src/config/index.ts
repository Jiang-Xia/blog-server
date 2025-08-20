import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
/*
 * mysql8修改密码  alter user  user() identified by 'jiang123!!';
 * https://blog.csdn.net/qq_42618394/article/details/103181778
 */

type ConfigInterface = {
  databaseConfig: any;
  serveConfig: any;
  accountConfig: any;
  fileConfig: any;
  appConfig: any;
};
export let Config: ConfigInterface = {
  databaseConfig: {},
  serveConfig: {},
  accountConfig: {},
  fileConfig: {},
  appConfig: {},
};
export const InitConfig = () => {
  const conf = new ConfigService();
  const env = process.env.NODE_ENV;
  Logger.warn(`当前环境： ${env} ${conf.get('app_desc')}`);
  const databaseConfig: any = {
    type: conf.get('db_type'),
    host: conf.get('db_host'),
    port: parseInt(conf.get('db_port') as string),
    username: conf.get('db_username'),
    password: conf.get('db_password') as string,
    database: conf.get('db_database'),
    logging: conf.get('db_logging').split(','),
    // 此字段生产不能设置为true否则字段有改变时 影响生产数据或清空。
    synchronize: conf.get('db_synchronize') === 'true',
  };
  /* 服务配置 */
  const serveConfig = {
    port: parseInt(conf.get('serve_port') as string),
    apiPath: conf.get('serve_apiPath'),
    baseUrl: conf.get('serve_baseUrl'),
    isDev: env !== 'production',
  };
  /* 初始化账户 */
  const accountConfig = {
    mobile: conf.get('account_mobile'),
    password: conf.get('account_password'),
    role: conf.get('account_role'),
    nickname: conf.get('account_nickname'),
    passwordRepeat: conf.get('account_passwordRepeat'),
  };
  /* 文件存储位置 */
  const fileConfig = {
    filePath: conf.get('file_filePath'), // 直接使用本nestjs服务做静态资源服务
  };
  // 应用全局配置
  const appConfig = {
    openMsgLog: conf.get('app_openMsgLog') === 'true',
    closeMsgBodyLog: conf.get('app_closeMsgBodyLog') === 'true',
    gaoDeMapApiKey: conf.get('app_gaoDeMapApiKey'),
  };
  Config = {
    databaseConfig,
    serveConfig,
    accountConfig,
    fileConfig,
    appConfig,
  };
  console.warn(Config);
  return Config;
};
export default () => {
  return Config;
};
