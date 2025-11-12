import { Strategy } from 'passport-github2';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';
import { UserService } from '../../features/user/user.service';
import { User, UserRole } from '../../features/user/entity/user.entity';
import { encryptPassword, makeSalt, rsaDecrypt } from 'src/utils/cryptogram.util';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github', true) {
  constructor(private readonly userService: UserService) {
    super({
      clientID: Config.appConfig.githubClientId,
      clientSecret: Config.appConfig.githubClientSecret,
      callbackURL: Config.appConfig.githubCallbackUrl,
      scope: ['user:email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<User> {
    const { id, username, emails, photos, profileUrl } = profile;
    // console.log(id, username, emails, photos, '===============>');
    // 检查用户是否已经存在
    let user = await this.userService.findByGithubId(id);

    if (!user) {
      // 如果用户不存在，创建新用户
      const newUser = new User();
      newUser.homepage = profileUrl;
      newUser.nickname = username || emails[0].value;
      newUser.username = username;
      newUser.email = emails[0].value;
      newUser.avatar = photos[0]?.value || '';
      newUser.githubId = id;
      newUser.role = UserRole.AUTHOR; // 默认角色为作者
      newUser.mobile = username;
      const salt = makeSalt(); // 制作密码盐
      const hashPassword = encryptPassword('123456', salt); // 加密密码
      newUser.password = hashPassword;
      newUser.salt = salt;
      user = await this.userService.createUserFromGithub(newUser);
    } else {
      // 如果用户存在，更新用户信息
      user.nickname = username || user.nickname;
      user.email = emails[0].value;
      user.avatar = photos[0]?.value || user.avatar;
      user.githubId = id;
      user.homepage = profileUrl;

      await this.userService.updateUserFromGithub(user);
    }

    return user;
  }
}
