import { User } from '@libs/db/models/user.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { RegisterDto } from './dto/create-auth.dto';
import { DocumentType } from '@typegoose/typegoose';

export interface IData extends DocumentType<User> {
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User)
    private readonly userModel: ReturnModelType<typeof User>
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password } = registerDto;
    const duplicateUser = await this.userModel.findOne({ username });
    if (duplicateUser) {
      console.log(duplicateUser);
      return { errorMsg: '用户名已被占用！' };
    }
    const createdUser = new this.userModel({ username, pwd: password });
    return (await createdUser.save()) as IData;
  }
}
