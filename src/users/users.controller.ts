import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

enum USERMSG {
  FIND_MSG = '查询成功',
  CREATE_MSG = '成功创建用户',
  UPDATE_MSG = '成功更新用户信息',
  REMOVE_MSG = '成功删除用户'
}
@Controller('users')
@ApiTags('用户')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '返回用户列表' })
  async findAll() {
    const data = await this.usersService.findAll();
    return {
      code: 200,
      success: true,
      message: USERMSG.FIND_MSG,
      data
    };
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    return {
      code: 200,
      success: true,
      message: USERMSG.CREATE_MSG,
      data
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 id 返回用户信息' })
  async findOne(@Param('id') id: string) {
    const data = await this.usersService.find(id);
    return {
      code: 200,
      success: true,
      message: USERMSG.FIND_MSG,
      data
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑用户信息' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(id, updateUserDto);
    return {
      code: 200,
      success: true,
      message: USERMSG.UPDATE_MSG,
      data
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async remove(@Param('id') id: string) {
    const data = await this.usersService.remove(id);
    return {
      code: 200,
      success: true,
      message: USERMSG.REMOVE_MSG,
      data
    };
  }

  @Delete()
  @ApiOperation({ summary: '删除所有用户' })
  async removeAll() {
    const res = await this.usersService.removeAll();
    // res.map((i) => i.createdAt);
    console.log(res);
  }
}
