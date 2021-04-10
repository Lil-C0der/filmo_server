import { DbModule } from '@libs/db';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CommonService } from './common.service';

@Module({
  // 导入 ConfigModule，同时加载数据库模块
  // ConfigModule 可以读取全局变量等，isGlobal 表示可以在全局使用 ConfigModule
  imports: [ConfigModule.forRoot({ isGlobal: true }), DbModule],
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonModule {}
