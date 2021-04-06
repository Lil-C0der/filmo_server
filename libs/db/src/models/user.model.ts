import { ModelOptions, prop, Ref } from '@typegoose/typegoose';
import { Post } from './post.model';

@ModelOptions({
  schemaOptions: { timestamps: true }
})
export class User {
  @prop()
  public username: string;
  @prop()
  public pwd: string;
  @prop({ ref: 'Post' })
  public posts: Ref<Post>[];
}
