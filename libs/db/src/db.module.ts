import { Global, Module } from '@nestjs/common';
import { DbService } from './db.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { User } from './models/user.model';
import { Post } from './models/post.model';
import { Movie } from './models/movie.model';

// 注册模型
const models = TypegooseModule.forFeature([User, Post, Movie]);

// 标记 db 模块为全局的模块
@Global()
@Module({
  imports: [
    // 注意：nest 中的模块是并行加载的，这里如果用 forFeature 加载，使用全局变量可能会读取不到
    // 异步加载数据库模块，连接数据库，才能使用环境变量
    TypegooseModule.forRootAsync({
      // 在 configModule 加载完成后才会执行 useFactory 方法
      useFactory() {
        return {
          uri: process.env.DB,
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        };
      }
    }),
    models
  ],
  providers: [DbService],
  // 导出模型
  exports: [DbService, models]
})
export class DbModule {}
