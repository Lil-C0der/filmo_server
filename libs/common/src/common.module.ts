import { DbModule } from '@libs/db';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { CommonService } from './common.service';

@Global()
@Module({
  // 导入 ConfigModule，同时加载 JWT 模块、数据库模块
  imports: [
    // ConfigModule 可以读取全局变量等，isGlobal 表示可以在全局使用 ConfigModule
    ConfigModule.forRoot({ isGlobal: true }),
    // 注册 JWT，secret 从环境变量读取，所以需要异步注册
    JwtModule.registerAsync({
      useFactory() {
        return {
          secret: process.env.SECRET,
          signOptions: { expiresIn: '60s' }
        };
      }
    }),
    DbModule
  ],
  providers: [CommonService],
  exports: [CommonService, JwtModule]
})
export class CommonModule {}
