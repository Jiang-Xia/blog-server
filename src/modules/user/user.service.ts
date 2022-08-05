/*
 * @Author: 酱
 * @LastEditors: 酱
 * @Date: 2021-11-16 16:52:15
 * @LastEditTime: 2022-08-05 22:51:02
 * @Description:
 * @FilePath: \blog-server\src\modules\user\user.service.ts
 */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { encryptPassword, makeSalt } from 'src/utils/cryptogram.util';
import { Repository } from 'typeorm';
import { RegisterDTO } from './dto/register.dto';
import { LoginDTO } from './dto/login.dto';
import { User } from './entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getPagination } from 'src/utils';
import { userListVO } from './vo/user-list.vo';
import { accountConfig } from 'src/config';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    /* class 初始化时会执行 constructor*/
    // 初始化账户
    const cUser: RegisterDTO = { ...accountConfig };

    this.register(cUser, true)
      .then(() =>
        console.log(
          `管理员账户创建成功，手机号：${accountConfig.mobile}，密码：${accountConfig.password}，请及时登录系统修改默认密码`,
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
    const hasUser = await this.userRepository.findOne({ mobile });
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
    const { nickname, password, mobile, role } = registerDTO;
    const salt = makeSalt(); // 制作密码盐
    const hashPassword = encryptPassword(password, salt); // 加密密码

    const newUser: User = new User();
    newUser.nickname = nickname;
    newUser.mobile = mobile;
    newUser.password = hashPassword;
    newUser.salt = salt;

    if (role && init) {
      newUser.role = role;
    }
    return await this.userRepository.save(newUser);
  }
  // 校验登录用户
  async checkLoginForm(loginDTO: LoginDTO): Promise<any> {
    const { mobile, password } = loginDTO;
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
    const token = this.jwtService.sign(payload);
    return token;
  }

  async login(loginDTO: LoginDTO): Promise<any> {
    // 用户信息
    const user = await this.checkLoginForm(loginDTO);
    // 密码和加盐不返回
    delete user.password;
    delete user.salt;
    const token = await this.certificate(user);
    return {
      info: {
        token,
        user,
      },
    };
  }

  /**
   * 获取指定用户
   * @param id
   */
  async findById(id: number): Promise<User> {
    return await this.userRepository.findOne(id);
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
    const oldItem = await this.userRepository.findOne(id);
    // merge - 将多个实体合并为一个实体。
    const updatedItem = await this.userRepository.merge(oldItem, {
      ...field,
    });
    // console.log({ updatedItem });
    return this.userRepository.save(updatedItem);
  }

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

  async deleteById(id) {
    try {
      /* !!! 注意 如果id为undefined会找到第一个 导致删除数据 */
      const user = await this.userRepository.findOne(id);
      // console.log(id, user);
      await this.userRepository.remove(user);
      return true;
    } catch (e) {
      throw new HttpException('删除失败', HttpStatus.BAD_REQUEST);
    }
  }
}
