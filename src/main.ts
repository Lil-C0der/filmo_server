import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 连接 mongoose
  mongoose.connect('mongodb://localhost/nest-blog-api', {
    useNewUrlParser: true,
    useFindAndModify: true,
    useCreateIndex: true
  });

  // 全局管道，类似中间件，请求会通过这个管道，这里是一个验证的功能
  app.useGlobalPipes(new ValidationPipe());

  // swagger 相关配置
  const config = new DocumentBuilder()
    .setTitle('filmo API')
    .setDescription('filmo 的 API')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);
  console.log(
    `成功启动，访问 http://localhost:${PORT}/api-docs 查看接口文档！💫💫`
  );
}
bootstrap();
