import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { getUid } from 'src/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.guard';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO } from './dto/register.dto';
import { UserService } from './user.service';
import { TokenResponse } from './vo/token.vo';
import { UserInfoResponse } from './vo/user-info.vo';
import { userListVO } from './vo/user-list.vo';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({ description: '注册', type: UserInfoResponse })
  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<UserInfoResponse> {
    return this.userService.register(registerDTO);
  }

  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ description: '登陆', type: TokenResponse })
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<any> {
    return this.userService.login(loginDTO);
  }

  // 获取用户信息需要鉴权
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '用户信息', type: TokenResponse })
  @Get('info')
  async userInfo(@Headers() headers): Promise<any> {
    const id = getUid(headers.authorization);
    return this.userService.findById(id);
  }

  @Post('list')
  async getMore(@Body() listDTO: any): Promise<userListVO> {
    return await this.userService.findAll(listDTO);
  }
  // 改变状态
  @Patch('status')
  updateById(@Body() user) {
    return this.userService.updateField(user);
  }

  @Roles(['super'])
  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteById(@Param('id') id) {
    return this.userService.deleteById(id);
  }
}
