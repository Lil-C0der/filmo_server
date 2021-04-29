import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, IData } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { User } from '@libs/db/models/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { PostsService } from 'src/posts/posts.service';

enum AUTHMSG {
  REGISTER_SUCCESS = '注册成功',
  REGISTER_FAILED = '注册失败',
  LOGIN_SUCCESS = '登录成功',
  LOGIN_FAILED = '登录失败',
  DETAIL_MSG = '成功获取用户信息'
}

interface IError {
  errorMsg: string;
}
@Controller('auth')
@ApiTags('权限')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
    private readonly postsService: PostsService
  ) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    const tmp = data as IError;
    if (tmp.errorMsg) {
      return {
        code: 500,
        success: false,
        msg: AUTHMSG.REGISTER_FAILED,
        data: {
          error: tmp.errorMsg
        }
      };
    }
    return {
      code: 200,
      success: true,
      msg: AUTHMSG.REGISTER_SUCCESS,
      data
    };
  }

  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  // 这个 guard 运行在接口的请求之前，只要发起请求，就会经过这个守卫
  @UseGuards(AuthGuard('local'))
  async login(@Body() loginDto: LoginDto, @Req() req) {
    const { user: temp }: { user: DocumentType<User> | IError } = req;

    const err = temp as IError;
    if (err.errorMsg) {
      // data =
      return {
        code: 401,
        success: false,
        msg: AUTHMSG.LOGIN_FAILED,
        data: {
          error: err.errorMsg
        }
      };
    } else {
      const user = temp as DocumentType<User>;
      console.log('用户id', user._id);
      const token = this.jwtService.sign({ id: user._id });
      console.log('用户token', token);
      // 需要返回一个 token 给前端
      return {
        code: 200,
        success: true,
        msg: AUTHMSG.LOGIN_SUCCESS,
        data: {
          user,
          // 根据用户名和 mongo 提供的 id 生成 token
          token
        }
      };
    }
  }

  @Get('user')
  @ApiOperation({ summary: '获取个人信息' })
  @UseGuards(AuthGuard('jwt'))
  // swagger 装饰器，表示可以添加头部字段
  @ApiBearerAuth()
  async userDetail(@Req() req) {
    let { user }: { user: DocumentType<User> } = req;

    const tmp: IData = JSON.parse(JSON.stringify(user));
    // @ts-ignore
    tmp.posts = await this.postsService.findAllPostsByCreatorId(user.id);

    return {
      code: 200,
      success: true,
      msg: AUTHMSG.DETAIL_MSG,
      data: {
        // user
        user: tmp
      }
    };
  }
}
