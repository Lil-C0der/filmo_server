import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { PostsService } from 'src/posts/posts.service';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  // 注意：编写的策略需要导入并使用
  providers: [AuthService, LocalStrategy, JwtStrategy, PostsService]
})
export class AuthModule {}
