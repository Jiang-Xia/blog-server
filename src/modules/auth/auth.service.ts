import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}
  //   校验是否有这个用户
  async validateUser(payload: User) {
    const user = await this.userService.findById(payload.id);
    // console.log('validateUser', user);
    return user;
  }
}
