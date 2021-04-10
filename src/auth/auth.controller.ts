import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';

@Controller('auth')
@ApiTags('权限')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  // 这个 guard 运行在接口的请求之前，只要发起请求，就会经过这个守卫
  @UseGuards(AuthGuard('local'))
  async login(@Body() loginDto: LoginDto, @Req() req) {
    console.log(445);

    return req;
  }

  @Get('user')
  @ApiOperation({ summary: '获取个人信息' })
  async userDetail(@Body() userDto) {
    return userDto;
  }
}