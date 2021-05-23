import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService, IUserData } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { User } from '@libs/db/models/user.model';
import { DocumentType } from '@typegoose/typegoose';
import { PostsService } from 'src/posts/posts.service';
import { MoviesService } from 'src/movies/movies.service';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';

enum AUTHMSG {
  REGISTER_SUCCESS = '注册成功',
  REGISTER_FAILED = '注册失败',
  LOGIN_SUCCESS = '登录成功',
  LOGIN_FAILED = '登录失败',
  DETAIL_MSG = '成功获取用户信息',
  MARK_MSG = '标记成功',
  REMOVE_MSG = '已从列表移除',
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
    private readonly postsService: PostsService,
    private readonly movieService: MoviesService
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
          error: tmp.errorMsg,
        },
      };
    }
    return {
      code: 200,
      success: true,
      msg: AUTHMSG.REGISTER_SUCCESS,
      data,
    };
  }

  async parseUserPostsAndMovieList(user: DocumentType<User>) {
    const tmp: IUserData = JSON.parse(JSON.stringify(user));
    // @ts-ignore
    tmp.posts = await this.postsService.findAllPostsByCreatorId(user.id);
    // collectionList
    const promiseArr = user.collectionList.map(
      // @ts-ignore
      async (_id) => await this.movieService.findOneByMongoId(_id)
    );
    // watchedList
    const promiseArr2 = user.watchedList.map(
      // @ts-ignore
      async (_id) => await this.movieService.findOneByMongoId(_id)
    );
    tmp.collectionList = await (await Promise.all(promiseArr)).filter((m) => m);
    tmp.watchedList = await (await Promise.all(promiseArr2)).filter((m) => m);
    return tmp;
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
          error: err.errorMsg,
        },
      };
    } else {
      const user = temp as DocumentType<User>;
      console.log('用户id', user._id);
      const token = this.jwtService.sign({ id: user._id });
      console.log('用户token', token);
      const tmp = await this.parseUserPostsAndMovieList(user);
      // 需要返回一个 token 给前端
      return {
        code: 200,
        success: true,
        msg: AUTHMSG.LOGIN_SUCCESS,
        data: {
          user: tmp,
          // 根据用户名和 mongo 提供的 id 生成 token
          token,
        },
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

    const tmp = await this.parseUserPostsAndMovieList(user);

    return {
      code: 200,
      success: true,
      msg: AUTHMSG.DETAIL_MSG,
      data: {
        user: tmp,
      },
    };
  }

  @Post('addToList')
  @ApiOperation({ summary: '收藏 / 看过电影' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async addToList(@Body() movieDto: CreateMovieDto, @Req() req) {
    const { user }: { user: DocumentType<User> } = req;
    const newMovie = await this.movieService.create(movieDto);
    const { targetList } = movieDto;

    // push 的是电影 id，因为 RefType 默认是 id
    if (newMovie) {
      if (targetList === 10 && !user.collectionList.includes(newMovie._id)) {
        user.collectionList.push(newMovie);
        await user.save();
      }
      if (targetList === 20 && !user.watchedList.includes(newMovie._id)) {
        user.watchedList.push(newMovie);
        await user.save();
      }
    }

    return {
      code: 200,
      success: true,
      msg: AUTHMSG.MARK_MSG,
      data: {
        user,
        // user: tmp
      },
    };
  }

  @Post('removeFromList')
  @ApiOperation({ summary: '从收藏 / 看过列表中移除电影' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async removeFromList(@Body() movieDto: CreateMovieDto, @Req() req) {
    const { user }: { user: DocumentType<User> } = req;
    const { id } = movieDto.movie;
    const { targetList } = movieDto;
    const { collectionList, watchedList } = user;

    const movieRes = await this.movieService.findOneByMovieId(id);
    console.log('query movie', movieRes);

    if (movieRes && movieRes._id) {
      if (targetList === 10) {
        const idx = collectionList.indexOf(movieRes._id);
        console.log(idx, user.collectionList);
        idx >= 0 && user.collectionList.splice(idx, 1);
        await user.save();
      }
      if (targetList === 20) {
        const idx = watchedList.indexOf(movieRes._id);
        console.log(idx, user.watchedList);
        idx >= 0 && user.watchedList.splice(idx, 1);
        await user.save();
      }
    }

    // if (collectionList.map((m) => m.id).includes(id)) {
    //   console.log(111, 'includes');
    // }

    return {
      code: 200,
      success: true,
      msg: AUTHMSG.REMOVE_MSG,
      data: {
        user,
        // user: tmp
      },
    };
  }
}
