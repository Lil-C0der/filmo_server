import { Post } from '@libs/db/models/post.model';
import { Movie } from '@libs/db/models/movie.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DocumentType } from '@typegoose/typegoose';
import { ReplyPostDto } from './dto/reply-post.dto';

export interface IPostData extends DocumentType<Post> {
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: ReturnModelType<typeof Post>
  ) {}

  async create(
    createPostDto: CreatePostDto & {
      creatorUsername: string;
      creatorId: string;
    }
  ) {
    const createdPost = new this.postModel(createPostDto);
    createdPost.id = createdPost._id;
    const newPost = await createdPost.save();

    return newPost as IPostData;
  }

  async findAll() {
    const posts = (await this.postModel.find()) as IPostData[];
    return {
      posts: posts
        .map(
          ({
            title,
            _id,
            content,
            creatorId,
            creatorUsername,
            createdAt,
            updatedAt,
            replies
          }) => ({
            title,
            id: _id,
            content,
            creatorId,
            creatorUsername,
            createdAt,
            updatedAt,
            replies,
            repliesNum: replies.length
          })
        )
        .reverse(),
      total: posts.length
    };
  }

  async find(id: string) {
    const tagretPost = await this.postModel.findById(id);
    tagretPost.id = tagretPost._id;
    return tagretPost as IPostData;
  }

  async findAllPostsByCreatorId(creatorId: string) {
    const posts = (await (await this.postModel.find())
      .filter((post) => post.creatorId === creatorId)
      .reverse()) as IPostData[];

    return posts.map(
      ({
        title,
        _id,
        content,
        creatorId,
        creatorUsername,
        createdAt,
        updatedAt,
        replies
      }) => ({
        title,
        id: _id,
        content,
        creatorId,
        creatorUsername,
        createdAt,
        updatedAt,
        repliesNum: replies.length
      })
    );
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.postModel.findOneAndUpdate({ _id: id }, updatePostDto);
    return (await this.postModel.findOne({ _id: id }).exec()) as IPostData;
  }

  /**
   * @param {string} id 被回复帖子的 id
   * @param {ReplyPostDto} replyPostDto
   * @return {*}
   * @memberof PostsService
   */
  async reply(
    id: string,
    replyPostDto: ReplyPostDto & { username: string; userId: string }
  ) {
    const postToUpdated = await this.postModel.findById(id);
    postToUpdated.replies.push(replyPostDto);
    await this.postModel.findOneAndUpdate({ _id: id }, postToUpdated);

    return (await this.postModel.findOne({ _id: id }).exec()) as IPostData;
  }

  async remove(id: string) {
    await this.postModel.findOneAndDelete({ _id: id });
    const data = await this.postModel.find();
    return data as IPostData[];
  }

  async removeAll() {
    await this.postModel.deleteMany((userId) => !userId);
    return (await this.postModel.find().exec()) as IPostData[];
  }
}
