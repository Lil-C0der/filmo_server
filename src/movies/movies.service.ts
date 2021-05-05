import { DocumentType } from '@typegoose/typegoose';
import { Movie } from '@libs/db/models/movie.model';
import { Injectable } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { CreateMovieDto } from './dto/create-movie.dto';

export interface IMovieData extends DocumentType<Movie> {
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable()
export class MoviesService {
  constructor(
    @InjectModel(Movie)
    private readonly movieModel: ReturnModelType<typeof Movie>
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const { movie: movieInfo } = createMovieDto;
    const duplicateMovie = await this.movieModel.findOne({
      id: movieInfo.id
    });
    if (duplicateMovie) {
      console.log(111, '已存在的电影', duplicateMovie.nm);
      return duplicateMovie;
    }

    const createdMovie = new this.movieModel(movieInfo);
    const newMovie = await createdMovie.save();

    console.log(newMovie);
    return newMovie as IMovieData;
  }

  async findAll() {
    return await this.movieModel.find();
  }

  async findOne(id: string) {
    const res = await this.movieModel.findById(id);
    return res;
  }

  async removeAll() {
    return await this.movieModel.deleteMany((_id) => _id);
  }
}
