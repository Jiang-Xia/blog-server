import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { File } from './resources.entity';
import { diskStorage } from 'multer';
import * as dayjs from 'dayjs';
import * as nuid from 'nuid';
import { fileConfig } from '../../config';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
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
          destination: `${fileConfig.filePath}${dayjs().format('YYYY-MM-DD')}`,
          filename: (req, file, cb) => {
            // console.log(req, file);
            // 解决上传文件名中文乱码问题
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const originalname = file.originalname;
            // 在此处自定义保存后的文件名称
            // const filename = `${nuid.next()}.${file.originalname.split('/')[1]}`;
            const filename = `${nuid.next().toLowerCase()}-${originalname}`;

            return cb(null, filename);
          },
        }),
      }),
      inject: [],
    }),
  ],
  exports: [ResourcesService],
  providers: [ResourcesService],
  controllers: [ResourcesController],
})
export class ResourcesModule {}
