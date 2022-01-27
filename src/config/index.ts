import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getLocalIP } from 'src/utils';
const env = process.env.NODE_ENV;
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: env === 'production' ? '42.192.145.236' : 'localhost',
  port: 3306,
  username: 'root',
  password: 'jiang123!!',
  database: 'myblog',
};

export const serveConfig = {
  ip: getLocalIP(),
  prot: 5000,
  apiPath: 'api',
  isDev: env !== 'production',
};
