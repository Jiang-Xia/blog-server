import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  UseGuards,
  Patch,
  Delete,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiBody, ApiOkResponse, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { getUid } from 'src/utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.guard';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO, resetPassword } from './dto/register.dto';
import { UserService } from './user.service';
import { TokenResponse } from './vo/token.vo';
import { UserInfoResponse } from './vo/user-info.vo';
import { userListVO } from './vo/user-list.vo';
import * as svgCaptcha from 'svg-captcha';

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  //利用svg-captcha生成校验码图片并存储在前端session中
  @ApiOperation({ summary: '验证码生成', description: '验证码' })
  @Get('code')
  createCaptcha(@Req() req, @Res() res) {
    const captcha = svgCaptcha.create({
      size: 4, //生成几个验证码
      fontSize: 50, //文字大小
      ignoreChars: '0o1i', // 忽略字符
      width: 100, //宽度
      height: 34, //高度
      background: '#cc9966', //背景颜色
    });
    req.session.code = captcha.text; //存储验证码记录到session
    res.type('image/svg+xml');
    res.send(captcha.data);
  }

  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({ description: '注册', type: UserInfoResponse })
  @ApiOperation({ summary: '账号注册', description: '注册' })
  @Post('register')
  async register(@Body() registerDTO: RegisterDTO): Promise<UserInfoResponse> {
    return this.userService.register(registerDTO);
  }

  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ description: '登陆', type: TokenResponse })
  @ApiOperation({ summary: '账号登录', description: '注册' })
  @Post('login')
  async login(@Body() loginDTO: LoginDTO): Promise<any> {
    return this.userService.login(loginDTO);
  }

  // 获取用户信息需要鉴权
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '用户信息', type: UserInfoResponse })
  @Get('info')
  async userInfo(@Headers() headers): Promise<any> {
    const id = getUid(headers.authorization);
    return this.userService.findById(id);
  }

  @ApiOkResponse({ description: '用户列表', type: userListVO })
  @Post('list')
  async getMore(@Body() listDTO: any): Promise<userListVO> {
    return await this.userService.findAll(listDTO);
  }

  @ApiOkResponse({ description: '锁定状态', type: Boolean })
  @Patch('status')
  updateStatus(@Body() user) {
    return this.userService.updateField(user);
  }

  @ApiOkResponse({ description: '修改用户信息', type: UserInfoResponse })
  @Patch('edit')
  updateUser(@Body() user) {
    return this.userService.updateField(user);
  }

  @ApiOkResponse({ description: '修改密码', type: Boolean })
  @Patch('password')
  updatePassword(@Body() user) {
    return this.userService.updatePassword(user);
  }

  @ApiBody({ type: resetPassword })
  @ApiOkResponse({ description: '重置密码', type: () => Boolean })
  @Post('resetPassword')
  resetPassword(@Body() user) {
    return this.userService.resetPassword(user);
  }

  @Roles(['super'])
  @UseGuards(JwtAuthGuard)
  // http://localhost:5000/user/10 @Delete(':id') 需配合 (@Param('id') id）
  // 这样收到的参数是一个对象即{id} 需前后端配合比较麻烦
  @Delete()
  deleteById(@Query('id') id) {
    return this.userService.deleteById(id);
  }
}
