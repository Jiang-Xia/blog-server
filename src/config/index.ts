import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
/*
 * mysql8修改密码  alter user  user() identified by 'jiang123!!';
 * https://blog.csdn.net/qq_42618394/article/details/103181778
 */

type ConfigInterface = {
  redisConfig: any;
  databaseConfig: any;
  serveConfig: any;
  accountConfig: any;
  fileConfig: any;
  appConfig: any;
  payConfig: any;
};
export let Config: ConfigInterface = {
  redisConfig: {},
  databaseConfig: {},
  serveConfig: {},
  accountConfig: {},
  fileConfig: {},
  appConfig: {},
  payConfig: {},
};
export const InitConfig = () => {
  const conf = new ConfigService();
  const env = process.env.NODE_ENV;
  Logger.warn(`当前环境： ${env} ${conf.get('app_desc')}`);
  /* redis 配置 */
  const redisConfig: any = {
    host: conf.get('redis_host'),
    port: parseInt(conf.get('redis_port') as string),
    db: parseInt(conf.get('redis_db') as string),
  };
  /* 数据库配置 */
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
    emailHost: conf.get('app_emailHost'),
    emailPort: parseInt(conf.get('app_emailPort') as string),
    emailUser: conf.get('app_emailUser'),
    emailPass: conf.get('app_emailPass'),
    blogHome: conf.get('app_blogHome'),
    githubClientId: conf.get('app_githubClientId'),
    githubClientSecret: conf.get('app_githubClientSecret'),
    githubCallbackUrl: conf.get('app_githubCallbackUrl'),
  };
  // 支付宝配置（从 .env 读取 alipay* 小驼峰键）
  const payConfig = {
    alipayAppId: conf.get('pay_alipayAppId'),
    alipayPrivateKey: conf.get('pay_alipayPrivateKey'),
    alipayPublicKey: conf.get('pay_alipayPublicKey'),
    alipayGateway: conf.get('pay_alipayGateway'),
    alipaySignType: conf.get('pay_alipaySignType'),
    alipayTimeout: parseInt(conf.get('pay_alipayTimeout') as string),
    alipayNotifyUrl: conf.get('pay_alipayNotifyUrl'),
    alipayReturnUrl: conf.get('pay_alipayReturnUrl'),
  };
  Config = {
    redisConfig,
    databaseConfig,
    serveConfig,
    accountConfig,
    fileConfig,
    appConfig,
    payConfig,
  };
  console.warn(Config);
  return Config;
};
export default () => {
  return Config;
};
