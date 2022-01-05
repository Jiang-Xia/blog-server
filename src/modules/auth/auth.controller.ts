import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('权限模块')
@Controller('auth')
export class AuthController {}
