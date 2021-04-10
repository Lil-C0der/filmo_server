import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

enum POSTMSG {
  FIND_MSG = '查询成功',
  CREATE_MSG = '成功发表帖子',
  UPDATE_MSG = '成功编辑帖子',
  REMOVE_MSG = '成功删除帖子'
}

@Controller('posts')
@ApiTags('帖子')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: '创建帖子' })
  create(@Body() createPostDto: CreatePostDto) {
    const data = this.postsService.create(createPostDto);
    return {
      code: 200,
      success: true,
      message: POSTMSG.CREATE_MSG,
      data
    };
  }

  @Get()
  @ApiOperation({ summary: '返回所有的帖子' })
  findAll() {
    const data = this.postsService.findAll();
    return {
      code: 200,
      success: true,
      message: POSTMSG.FIND_MSG,
      data
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '返回指定帖子' })
  find(@Param('id') id: string) {
    const data = this.postsService.find(id);
    return {
      code: 200,
      success: true,
      message: POSTMSG.FIND_MSG,
      data
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑帖子' })
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    const data = this.postsService.update(id, updatePostDto);
    return {
      code: 200,
      success: true,
      message: POSTMSG.UPDATE_MSG,
      data
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除帖子' })
  remove(@Param('id') id: string) {
    const data = this.postsService.remove(id);
    return {
      code: 200,
      success: true,
      message: POSTMSG.REMOVE_MSG,
      data
    };
  }
}
