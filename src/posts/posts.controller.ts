import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Req
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DocumentType } from '@typegoose/typegoose';
import { User } from '@libs/db/models/user.model';
import { ReplyPostDto } from './dto/reply-post.dto';

enum POSTMSG {
  FIND_MSG = '查询成功',
  CREATE_MSG = '成功发表帖子',
  UPDATE_MSG = '成功编辑帖子',
  REPLY_MSG = '回帖成功',
  REMOVE_MSG = '成功删除帖子'
}

@Controller('posts')
@ApiTags('帖子')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // TODO token
  @Post()
  @ApiOperation({ summary: '创建帖子' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async create(@Body() createPostDto: CreatePostDto, @Req() req) {
    // 根据 token 查询用户，创建时带上 username userId
    const { user }: { user: DocumentType<User> } = req;

    const data = await this.postsService.create({
      ...createPostDto,
      creatorId: user._id,
      creatorUsername: user.username
    });

    return {
      code: 200,
      success: true,
      msg: POSTMSG.CREATE_MSG,
      data
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '回复帖子' })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  async reply(
    @Param('id') id: string,
    @Body() replyPostDto: ReplyPostDto,
    @Req() req
  ) {
    const { user }: { user: DocumentType<User> } = req;
    const data = await this.postsService.reply(id, {
      ...replyPostDto,
      username: user.username,
      userId: user.id
    });
    return {
      code: 200,
      success: true,
      msg: POSTMSG.REPLY_MSG,
      data
    };
  }

  @Get()
  @ApiOperation({ summary: '返回所有的帖子' })
  async findAll() {
    const data = await this.postsService.findAll();
    console.log(data);

    return {
      code: 200,
      success: true,
      msg: POSTMSG.FIND_MSG,
      data
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '返回指定帖子' })
  async find(@Param('id') id: string) {
    const data = await this.postsService.find(id);
    return {
      code: 200,
      success: true,
      msg: POSTMSG.FIND_MSG,
      data
    };
  }

  // @Put(':id')
  // @ApiOperation({ summary: '编辑帖子' })
  // async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
  //   const data = await this.postsService.update(id, updatePostDto);
  //   return {
  //     code: 200,
  //     success: true,
  //     msg: POSTMSG.UPDATE_MSG,
  //     data
  //   };
  // }

  @Delete(':id')
  @ApiOperation({ summary: '删除帖子' })
  async remove(@Param('id') id: string) {
    const data = await this.postsService.remove(id);
    return {
      code: 200,
      success: true,
      msg: POSTMSG.REMOVE_MSG,
      data
    };
  }

  @Delete()
  @ApiOperation({ summary: '删除所有帖子' })
  async removeAll() {
    const data = await this.postsService.removeAll();
    return {
      code: 200,
      success: true,
      msg: POSTMSG.REMOVE_MSG,
      data
    };
  }
}
