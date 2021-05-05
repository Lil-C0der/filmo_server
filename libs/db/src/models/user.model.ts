import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';
import { Movie } from './movie.model';
import { Post } from './post.model';

@ModelOptions({
  schemaOptions: { timestamps: true }
})
export class User {
  @prop()
  public username: string;
  // 对密码进行 hash 散列
  @prop({
    set(val) {
      return val ? hashSync(val) : val;
    },
    get(val) {
      return val;
    },
    // 默认从数据库查询时不返回密码
    select: false
  })
  public pwd: string;
  @prop({ ref: 'Post' })
  public posts: Ref<Post>[];
  @prop({ ref: 'Movie' })
  public watchedList: Ref<Movie>[];
  @prop({ ref: 'Movie' })
  public collectionList: Ref<Movie>[];
}
