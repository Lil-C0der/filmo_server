import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@libs/db/models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectModel(User)
    private userModel: ReturnModelType<typeof User>
  ) {
    super({
      // 从请求头中取出 token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // 用于还原 jwt
      secretOrKey: process.env.SECRET,
      ignoreExpiration: true
    } as StrategyOptions);
  }

  async validate({ id }) {
    console.log(`查询 id 为 ${id} 的用户信息`);
    const user = this.userModel.findById(id);
    return user;
  }
}
