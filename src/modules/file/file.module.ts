import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { MyFile } from './file.entity';
import { diskStorage } from 'multer';
import { Config } from '../../config';
import { HttpModule } from '@nestjs/axios';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forFeature([MyFile]),
    // HttpModule.registerAsync({
    //   useFactory: () => ({
    //     timeout: 5000,
    //     maxRedirects: 5,
    //   }),
    // }),
    HttpModule,
    AuthModule,
    MulterModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        storage: diskStorage({
          // 配置文件上传后的文件夹路径
          destination: (req, file, callback) => {
            const { hash } = req.query;
            const path = `${Config.fileConfig.filePath}tempFolder/${hash}`;
            // 创建文件夹
            fs.mkdir(path, { recursive: true }, (err) => {
              if (err) {
                console.log('创建文件夹失败', err);
                return;
              }
            });
            callback(null, path);
          },
          filename: (req, file, cb) => {
            // console.log(req, file);
            const { hash, index } = req.query;
            // console.log('Query Parameters:', queryParams);
            // 解决上传文件名中文乱码问题
            // file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            // 在此处自定义保存后的文件名称
            const filename = `${hash}-${index}`;

            return cb(null, filename);
          },
        }),
      }),
      inject: [],
    }),
  ],
  exports: [FileService],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
