import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { FileStore } from '../file/file.entity';
import { diskStorage } from 'multer';
import dayjs from 'dayjs';
import { Config } from '../../config';
import { HttpModule } from '@nestjs/axios';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    TypeOrmModule.forFeature([FileStore]),
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
          destination: `${Config.fileConfig.filePath}${dayjs().format('YYYY-MM')}`,
          filename: (req, file, cb) => {
            // console.log(req, file);
            // 解决上传文件名中文乱码问题
            file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
            const originalname = file.originalname;
            // 在此处自定义保存后的文件名称
            const uuId = uuidv4().replace(/-/g, '');
            const filename = `${uuId}-${originalname}`;

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
