import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './models/user.model';

// 注册模型
const models = TypegooseModule.forFeature([User]);

// 标记 db 模块为全局的模块
@Global()
@Module({
  imports: [
    // 连接数据库
    TypegooseModule.forRoot('mongodb://localhost:27017/filmo', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    }),
    models
  ],
  providers: [DbService],
  // 导出模型
  exports: [DbService, models]
})
export class DbModule {}
