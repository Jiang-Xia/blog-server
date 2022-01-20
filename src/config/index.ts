import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getLocalIP } from 'src/utils';
export const databaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '42.192.145.236',
  port: 3306,
  username: 'root',
  password: 'jiang123!!',
  database: 'myblog',
};

export const serveConfig = {
  ip: getLocalIP(),
  prot: 5000,
  apiPath: 'api',
  isDev: process.env.NODE_ENV !== 'production',
};
