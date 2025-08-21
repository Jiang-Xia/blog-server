import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../../security/auth/auth.module';
import { CaptchaModule } from '../../security/captcha/captcha.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    // auth和user相互依赖，解决循环依赖问题
    // https://docs.nestjs.cn/8/fundamentals?id=%e5%be%aa%e7%8e%af%e4%be%9d%e8%b5%96
    forwardRef(() => AuthModule),
    CaptchaModule,
  ],
  controllers: [UserController],
  // auth使用到user依赖，需要导出
  exports: [UserService],
  providers: [UserService],
})
export class UserModule {}
