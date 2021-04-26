import { ModelOptions, prop } from '@typegoose/typegoose';

// 回复楼层 需要有用户 id 和回复内容
interface IReply {
  userId: string;
  username: string;
  replyAt: string;
  content: string;
}

// 帖子
@ModelOptions({
  schemaOptions: { timestamps: true }
})
export class Post {
  @prop()
  public title: string;
  @prop()
  public id: string;
  @prop()
  public creatorId: string;
  @prop()
  public creatorUsername: string;
  @prop()
  public content: string;
  @prop()
  public replies: IReply[];
}
