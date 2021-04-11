import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { CurrentUser } from './current-user.decorator';
import { User } from '@libs/db/models/user.model';
import { DocumentType } from '@typegoose/typegoose';

enum AUTHMSG {
  REGISTER_MSG = '注册成功',
  LOGIN_MSG = '登录成功',
  DETAIL_MSG = '成功获取用户信息'
}

@Controller('auth')
@ApiTags('权限')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  // 这个 guard 运行在接口的请求之前，只要发起请求，就会经过这个守卫
  @UseGuards(AuthGuard('local'))
  async login(
    @Body() loginDto: LoginDto,
    @CurrentUser() user: DocumentType<User>
  ) {
    console.log('用户登录', user);
    console.log('用户id', user._id);
    const token = this.jwtService.sign({ id: user._id });
    console.log('用户token', token);

    // 需要返回一个 token 给前端
    return {
      code: 200,
      success: true,
      msg: AUTHMSG.LOGIN_MSG,
      data: {
        user,
        // 根据用户名和 mongo 提供的 id 生成 token
        token
      }
    };
  }

  @Get('user')
  @ApiOperation({ summary: '获取个人信息' })
  @UseGuards(AuthGuard('jwt'))
  // swagger 装饰器，表示可以添加头部字段
  @ApiBearerAuth()
  async userDetail(@CurrentUser() user: DocumentType<User>) {
    return {
      code: 200,
      success: true,
      msg: AUTHMSG.DETAIL_MSG,
      data: {
        user
      }
    };
  }
}
