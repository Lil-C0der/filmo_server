import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { hashSync } from 'bcryptjs';
import { Post } from './post.model';

interface IMovie {
  id: number | string;
  name: string;
  imgUrl: string;
}
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
  @prop()
  public watchedList: IMovie[];
  @prop()
  public favoritesList: IMovie[];
}
