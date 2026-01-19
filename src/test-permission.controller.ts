import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './modules/security/auth/jwt-auth.guard';

@Controller('test')
export class TestPermissionController {
  @Get('public-data')
  // 这个接口应该是公开的，不需要认证
  getPublicData() {
    return { message: '这是公开数据' };
  }

  @Get('users')
  @UseGuards(JwtAuthGuard) // 需要认证
  getUsers() {
    return { message: '获取用户列表', permission: 'user:list' };
  }

  @Get('users/:id')
  @UseGuards(JwtAuthGuard) // 需要认证
  getUser(@Param('id') id: string) {
    return { message: `获取用户 ${id}`, permission: 'user:read' };
  }

  @Post('users')
  @UseGuards(JwtAuthGuard) // 需要认证
  createUser(@Body() userData: any) {
    return { message: '创建用户', permission: 'user:create', data: userData };
  }

  @Put('users/:id')
  @UseGuards(JwtAuthGuard) // 需要认证
  updateUser(@Param('id') id: string, @Body() userData: any) {
    return { message: `更新用户 ${id}`, permission: 'user:update', data: userData };
  }

  @Delete('users/:id')
  @UseGuards(JwtAuthGuard) // 需要认证
  deleteUser(@Param('id') id: string) {
    return { message: `删除用户 ${id}`, permission: 'user:delete' };
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard) // 需要认证
  getProfile() {
    return { message: '获取个人资料', permission: 'profile:read' };
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard) // 需要认证
  updateProfile(@Body() profileData: any) {
    return { message: '更新个人资料', permission: 'profile:update', data: profileData };
  }
}
