import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Post } from '@libs/db/models/post.model';

@Module({
  imports: [Post],
  controllers: [PostsController],
  providers: [PostsService]
})
export class PostsModule {}
