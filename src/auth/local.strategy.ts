import { Strategy, IStrategyOptions } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { User } from '@libs/db/models/user.model';
import { compareSync } from 'bcryptjs';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
// 本地策略：username + password
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(
    @InjectModel(User)
    private userModel: ReturnModelType<typeof User>
  ) {
    super({
      passwordField: 'password'
    } as IStrategyOptions);
  }

  async validate(username: string, password: string): Promise<any> {
    // 查找用户
    const user = await this.userModel.findOne({ username }).select('+pwd');

    if (!user) {
      throw new UnauthorizedException('用户名不存在！');
    }

    if (!compareSync(password, user.pwd)) {
      throw new UnauthorizedException('密码错误！');
    }

    return user;
  }
}
