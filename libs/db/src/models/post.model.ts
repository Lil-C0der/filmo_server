import { ModelOptions, prop } from '@typegoose/typegoose';

// 帖子
@ModelOptions({
  schemaOptions: { timestamps: true }
})
export class Post {
  @prop()
  public title: string;
  @prop()
  public content: string;
  @prop()
  public replies: string[];
}
