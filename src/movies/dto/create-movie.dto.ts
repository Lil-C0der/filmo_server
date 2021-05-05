export class CreateMovieDto {
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
}
