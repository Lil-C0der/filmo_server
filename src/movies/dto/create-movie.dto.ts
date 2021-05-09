import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMovieDto {
  @ApiProperty({ description: '电影对象' })
  @IsNotEmpty({ message: '缺少电影对象' })
  movie: {
    // id: string;
    id: number;
    nm: string;
    enm: string;
    imgUrl: string;
    star: string; // 主演
    fra: string; // 地区
    rt: string; //	上映时间
    sc: string;
    wish: number;
  };
  @ApiProperty({ description: '目标列表' })
  @IsNotEmpty({ message: '缺少目标列表' })
  targetList: 10 | 20;
}
