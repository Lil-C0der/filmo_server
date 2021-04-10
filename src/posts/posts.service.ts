import { Post } from '@libs/db/models/post.model';
import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DocumentType } from '@typegoose/typegoose';

export interface IData extends DocumentType<Post> {
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post)
    private readonly postModel: ReturnModelType<typeof Post>
  ) {}

  async create(createPostDto: CreatePostDto) {
    const createdUser = new this.postModel(createPostDto);
    return (await createdUser.save()) as IData;
  }

  async findAll() {
    return (await this.postModel.find()) as IData[];
  }

  async find(id: string) {
    return (await this.postModel.findById(id)) as IData;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    await this.postModel.findOneAndUpdate({ _id: id }, updatePostDto);
    return (await this.postModel.findOne({ _id: id }).exec()) as IData;
  }

  async remove(id: string) {
    await this.postModel.findOneAndDelete({ _id: id });
    const data = await this.postModel.find();
    return data as IData[];
  }

  async removeAll() {
    await this.postModel.deleteMany((_id) => _id);
    return (await this.postModel.find().exec()) as IData[];
  }
}
