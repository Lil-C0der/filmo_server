import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('movies')
@ApiTags('电影')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @ApiOperation({ summary: '新增电影' })
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Get()
  @ApiOperation({ summary: '所有电影' })
  findAll() {
    return this.moviesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '查找电影' })
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(id);
  }

  @Delete()
  @ApiOperation({ summary: '删除所有电影' })
  removeAll() {
    return this.moviesService.removeAll();
  }
}
