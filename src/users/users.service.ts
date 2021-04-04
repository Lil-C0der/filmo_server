import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

interface IData {
  id: string;
  username: string;
  pwd: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    console.log(111, createUserDto);
    const createdUser = new this.userModel(createUserDto);
    const { id, username, pwd } = await createdUser.save();

    return { id, username, pwd };
  }

  async findAll() {
    const res = await (
      await this.userModel.find()
    ).map(({ _id: id, username, pwd }) => ({ id, username }));

    return res;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
