/*
 * @Author: 酱
 * @LastEditors: jx
 * @Date: 2021-11-16 16:52:15
 * @LastEditTime: 2024-04-05 23:17:08
 * @Description:
 * @FilePath: \blog-server\src\modules\user\user.service.ts
 */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encryptPassword, makeSalt, rsaDecrypt } from 'src/utils/cryptogram.util';
import { Repository } from 'typeorm';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getPagination } from 'src/utils';
import { userListVO } from './vo/user-list.vo';
import { Config } from 'src/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    /* class 初始化时会执行 constructor*/
    // 初始化账户
    const cUser: RegisterDTO = { ...Config.accountConfig };

    this.register(cUser, true)
      .then(() =>
        console.log(
          `管理员账户创建成功，手机号：${Config.accountConfig.mobile}，密码：${Config.accountConfig.password}，请及时登录系统修改默认密码`,
        ),
      )
      .catch(() => {
        // console.log(
        //   `管理员账户已经存在，手机号：${accountConfig.mobile}，密码：${accountConfig.password}，请及时登录系统修改默认密码`,
        // );
      });
  }

  // 校验注册信息
  async checkRegisterForm(registerDTO: RegisterDTO): Promise<any> {
    if (registerDTO.password !== registerDTO.passwordRepeat) {
      throw new NotFoundException('两次输入的密码不一致，请检查');
    }
    const { mobile } = registerDTO;
    const hasUser = await this.userRepository.findOne({ where: { mobile } });
    if (hasUser) {
      throw new NotFoundException('用户已存在');
    }
  }

  // 注册
  async register(registerDTO: RegisterDTO, init?: boolean): Promise<any> {
    await this.checkRegisterForm(registerDTO);
    return await this.createUser(registerDTO, init);
  }

  async createUser(registerDTO: RegisterDTO, init?: boolean) {
    const { nickname, password, mobile, role, avatar } = registerDTO;
    const salt = makeSalt(); // 制作密码盐
    const hashPassword = encryptPassword(password, salt); // 加密密码

    const newUser: User = new User();
    newUser.nickname = nickname;
    newUser.mobile = mobile;
    newUser.password = hashPassword;
    newUser.salt = salt;
    newUser.avatar = avatar;
    if (role && init) {
      newUser.role = role;
    }
    return await this.userRepository.save(newUser);
  }
  // 校验登录用户
  async checkLoginForm(loginDTO: LoginDTO): Promise<any> {
    const { mobile } = loginDTO;
    // 解密密码
    const password = rsaDecrypt(loginDTO.password);
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.salt')
      .addSelect('user.password')
      .where('user.mobile = :mobile', { mobile })
      .getOne();

    // console.log('用户信息:', { user });

    if (!user) {
      throw new NotFoundException('用户不存在');
    } else if (user.status === 'locked') {
      throw new UnauthorizedException('账号已被锁定！');
    }
    // console.log({ user });
    const { password: dbPassword, salt } = user;
    // console.log({ currentHashPassword, dbPassword });
    if (!User.compactPass(password, dbPassword, salt)) {
      throw new NotFoundException('密码错误');
    }

    return user;
  }

  // 生成 token
  async certificate(user: User) {
    // 设置在token中的信息
    const payload = {
      id: user.id,
      nickname: user.nickname,
      mobile: user.mobile,
      role: user.role,
    };
    // console.log(payload);
    // 兼容老登录token
    const token = this.jwtService.sign(payload);
    const accessToken = this.jwtService.sign(payload, { expiresIn: '0.5h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      token,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDTO: LoginDTO): Promise<any> {
    // 用户信息
    const user = await this.checkLoginForm(loginDTO);
    // 密码和加盐不返回
    delete user.password;
    delete user.salt;
    const data = await this.certificate(user);
    return {
      info: {
        ...data,
        user,
      },
    };
  }
  /**
   * 根据refreshToken刷新accessToken
   * @param accessToken
   */
  async refresh(token: string) {
    try {
      let user = this.jwtService.verify(token);
      const data = await this.certificate(user);
      user = await this.findById(user.id);
      return {
        ...data,
        user,
        message: '刷新token成功',
      };
    } catch (e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }

  /**
   * 获取指定用户
   * @param id
   */
  async findById(id): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findAll(queryParams): Promise<userListVO> {
    const { page = 1, pageSize = 20, mobile } = queryParams;
    const sql = this.userRepository.createQueryBuilder('user');
    if (mobile) {
      sql.andWhere('user.mobile like :mobile', { mobile: `%${mobile}%` });
    }
    sql.orderBy('user.createTime', 'ASC');
    const getList = sql
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();
    const [list, total] = await getList;
    const pagination = getPagination(total, pageSize, page);
    return {
      list: list,
      pagination,
    };
  }

  /**
   * @description: 更新字段
   * @return {*} 设置成功信息
   */
  async updateField(field) {
    const { id } = field;
    delete field.id;
    const oldItem = await this.userRepository.findOne({ where: { id } });
    // merge - 将多个实体合并为一个实体。
    const updatedItem = await this.userRepository.merge(oldItem, {
      ...field,
    });
    // console.log({ updatedItem });
    return this.userRepository.save(updatedItem);
  }

  // 修改密码
  async updatePassword(field) {
    const { password, passwordRepeat, passwordOld, id } = field;
    if (password !== passwordRepeat) {
      throw new NotFoundException('两次输入的密码不一致，请检查');
    }
    // console.log({ password, passwordRepeat, passwordOld, id });
    const { password: dbPassword, salt } = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.salt')
      .addSelect('user.password')
      .where('user.id = :id', { id })
      .getOne();
    // console.log(user);

    if (!User.compactPass(passwordOld, dbPassword, salt)) {
      throw new NotFoundException('旧密码不不正确，请检查！');
    }
    const newSalt = makeSalt(); // 制作新密码盐
    const hashPassword = encryptPassword(password, newSalt); // 加密密码
    await this.updateField({
      password: hashPassword,
      salt: newSalt,
      id,
    });
    return true;
  }

  // 重置密码
  async resetPassword(field) {
    const { mobile, nickname } = field;
    // console.log({ password, passwordRepeat, passwordOld, id });
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.mobile = :mobile', { mobile })
      .where('user.nickname = :nickname', { nickname })
      .getOne();
    if (mobile !== user.mobile) {
      throw new NotFoundException('此用户不存在！');
    }
    const newSalt = makeSalt(); // 制作新密码盐
    const hashPassword = encryptPassword('123456', newSalt); // 加密密码
    await this.updateField({
      password: hashPassword,
      salt: newSalt,
      id: user.id,
    });
    return {
      message: '重置密码成功，默认密码为：123456',
    };
  }

  async deleteById(id) {
    try {
      /* !!! 注意 如果id为undefined会找到第一个 导致删除数据 */
      const user = await this.userRepository.findOne({ where: { id } });
      // console.log(id, user);
      await this.userRepository.remove(user);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 校验验证码是否一致
  authCodeMatch(sesssionCode: string, bodyCode: string) {
    const bool = bodyCode?.toLocaleUpperCase() === sesssionCode?.toLocaleUpperCase();
    // console.log({ sesssionCode, bodyCode, bool });
    if (bool) {
      return bool;
    } else {
      throw new InternalServerErrorException('验证码错误');
    }
  }
}
