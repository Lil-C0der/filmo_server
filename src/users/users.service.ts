import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../../libs/db/src/models/user.model';
import { DocumentType } from '@typegoose/typegoose';

export interface IData extends DocumentType<User> {
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>
  ) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return (await createdUser.save()) as IData;
  }

  async findAll() {
    return (await this.userModel.find()) as IData[];
  }

  async find(id: string) {
    return (await this.userModel.findById(id)) as IData;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto);
    return (await this.userModel.findOne({ _id: id }).exec()) as IData;
  }

  async remove(id: string) {
    await this.userModel.findOneAndDelete({ _id: id });
    const data = await this.userModel.find();
    return data as IData[];
  }

  async removeAll() {
    await this.userModel.deleteMany((_id) => _id);
    return (await this.userModel.find().exec()) as IData[];
  }
}
