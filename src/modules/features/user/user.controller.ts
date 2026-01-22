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
  Param,
  Req,
  Res,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { getUid } from 'src/utils';
import { JwtAuthGuard } from '../../security/auth/jwt-auth.guard';
import { LoginDTO } from './dto/login.dto';
import { RegisterDTO, resetPassword } from './dto/register.dto';
import { EmailRegisterDTO } from './dto/email-register.dto';
import { EmailLoginDTO } from './dto/email-login.dto';
import { SendEmailCodeDTO } from './dto/send-email-code.dto';
import { UserService } from './user.service';
import { TokenResponse } from './vo/token.vo';
import { UserInfoResponse } from './vo/user-info.vo';
import { userListVO } from './vo/user-list.vo';
import { CaptchaService } from '../../security/captcha/captcha.service';
import { Config } from '../../../config';
import { AuthGuard } from '@nestjs/passport';
import { AdminCreateUserDTO } from './dto/admin-create-user.dto';
import { AdminUpdateUserDTO } from './dto/admin-update-user.dto';
import { User } from './entity/user.entity';

type SessionReq = Request & { session: Record<string, any> };

@ApiTags('用户模块')
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private captchaService: CaptchaService,
  ) {}

  //利用svg-captcha生成校验码图片并存储在前端session中
  @ApiOperation({ summary: '验证码生成', description: '验证码' })
  @Get('authCode')
  async createCaptcha(@Req() req: SessionReq, @Res() res: Response) {
    try {
      const captcha = await this.captchaService.create();
      // 将验证码ID设置到Cookie中，方便后续验证
      res.cookie('captcha_id', captcha.id, {
        httpOnly: true, // 防止 XSS 攻击
        maxAge: 120000, // 2分钟
        sameSite: 'strict', // 防止 CSRF 攻击
        secure: !Config.serveConfig.isDev, // 生产环境需要设置为true
        path: '/',
      });
      res.setHeader('Content-Type', 'image/svg+xml');
      res.setHeader('Cache-Control', 'no-cache, no-store');
      res.send(captcha.svg);
    } catch (error) {
      res.status(500).send('生成验证码失败');
    }
  }

  @ApiBody({ type: RegisterDTO })
  @ApiOkResponse({ description: '注册', type: UserInfoResponse })
  @ApiOperation({ summary: '账号注册', description: '注册' })
  @Post('register')
  async register(@Req() req: Request, @Body() registerDTO: RegisterDTO): Promise<any> {
    const captchaId = req.cookies?.captcha_id; // 从Cookie中获取验证码ID
    const bool = await this.captchaService.verify(captchaId, registerDTO.authCode || '');
    if (bool) {
      return this.userService.register(registerDTO);
    }
  }

  @ApiBody({ type: LoginDTO })
  @ApiOkResponse({ description: '登陆', type: TokenResponse })
  @ApiOperation({ summary: '账号登陆', description: '登陆' })
  @Post('login')
  async login(@Req() req: Request, @Body() loginDTO: LoginDTO): Promise<any> {
    const captchaId = req.cookies?.captcha_id; // 从Cookie中获取验证码ID
    const bool = await this.captchaService.verify(captchaId, loginDTO.authCode);
    if (bool) {
      return this.userService.login(loginDTO);
    }
  }

  @ApiQuery({ name: 'token', type: String })
  @ApiOkResponse({ description: '刷新token', type: Object })
  @ApiOperation({ summary: '刷新token', description: '刷新token' })
  @Get('refresh')
  async refresh(@Query('token') token: string): Promise<any> {
    return this.userService.refresh(token);
  }
  // 获取用户信息需要鉴权
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: '用户信息', type: UserInfoResponse })
  @Get('info')
  async userInfo(@Headers() headers, @Query('id') userId: number): Promise<any> {
    const id = getUid(headers.authorization);
    return this.userService.getUserRolePrivilegeInfo(userId || id);
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

  @UseGuards(JwtAuthGuard)
  // http://localhost:5000/user/10 @Delete(':id') 需配合 (@Param('id') id）
  // 这样收到的参数是一个对象即{id} 需前后端配合比较麻烦
  @Delete()
  deleteById(@Query('id') id) {
    return this.userService.deleteById(id);
  }

  // ==================== 邮箱相关接口 ====================

  @ApiBody({ type: SendEmailCodeDTO })
  @Post('email/sendCode')
  @ApiOperation({ summary: '发送邮箱验证码', description: '发送邮箱验证码' })
  async sendEmailCode(@Body() sendEmailCodeDTO: SendEmailCodeDTO): Promise<any> {
    return this.userService.sendEmailCode(sendEmailCodeDTO);
  }

  @ApiBody({ type: EmailRegisterDTO })
  @ApiOkResponse({ description: '邮箱注册', type: UserInfoResponse })
  @ApiOperation({ summary: '邮箱注册', description: '通过邮箱和验证码注册账号' })
  @Post('email/register')
  async emailRegister(@Body() emailRegisterDTO: EmailRegisterDTO): Promise<any> {
    return this.userService.emailRegister(emailRegisterDTO);
  }

  @ApiBody({ type: EmailLoginDTO })
  @ApiOkResponse({ description: '邮箱登录', type: TokenResponse })
  @ApiOperation({ summary: '邮箱登录', description: '通过邮箱和验证码登录账号' })
  @Post('email/login')
  async emailLogin(@Body() emailLoginDTO: EmailLoginDTO): Promise<any> {
    return this.userService.emailLogin(emailLoginDTO);
  }

  @Get('auth/github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {}

  @Get('auth/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req, @Res() res) {
    const data = await this.userService.certificate(req.user);
    const url = `${Config.appConfig.blogHome}/login?accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`;
    res.redirect(url);
  }

  @ApiBody({ type: AdminCreateUserDTO })
  @ApiOkResponse({ description: '管理员创建用户', type: User })
  @ApiOperation({
    summary: '管理员创建用户',
    description: '仅限超级管理员创建用户并绑定角色和部门',
  })
  @UseGuards(JwtAuthGuard)
  @Post('admin/create')
  async adminCreateUser(@Body() adminCreateUserDTO: AdminCreateUserDTO): Promise<User> {
    return await this.userService.adminCreateUser(adminCreateUserDTO);
  }

  @ApiBody({ type: AdminUpdateUserDTO })
  @ApiOkResponse({ description: '管理员更新用户', type: User })
  @ApiOperation({
    summary: '管理员更新用户',
    description: '仅限超级管理员更新用户信息并绑定角色和部门（手机号和用户名不可修改）',
  })
  @UseGuards(JwtAuthGuard)
  @Post('admin/update/:id')
  async adminUpdateUser(
    @Param('id') id: number,
    @Body() adminUpdateUserDTO: AdminUpdateUserDTO,
  ): Promise<User> {
    const result = await this.userService.adminUpdateUser(id, adminUpdateUserDTO);
    if (!result) {
      throw new Error('用户更新失败');
    }
    return result;
  }
}
