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

@Controller('users')
@ApiTags('用户')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '返回用户列表' })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);
    console.log(data);

    return {
      code: 200,
      success: true,
      message: '成功创建用户',
      data
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '根据 id 返回用户信息' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: '编辑用户信息' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
