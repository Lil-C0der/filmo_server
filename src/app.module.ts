import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from '@libs/common';

@Module({
  // 数据库模块在 CommonModule 中引入
  imports: [CommonModule, UsersModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
