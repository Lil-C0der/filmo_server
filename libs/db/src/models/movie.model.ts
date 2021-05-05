import { ModelOptions, prop } from '@typegoose/typegoose';

ModelOptions({
  schemaOptions: { timestamps: true }
});
export class Movie {
  @prop()
  // public id: string;
  public id: number;
  @prop()
  public nm: string;
  @prop()
  public enm: string;
  @prop()
  public imgUrl: string;
  @prop()
  public star: string; // 主演
  @prop()
  public fra: string; // 地区
  @prop()
  public rt: string; //	上映时间
  @prop()
  public sc: string; //	评分
  @prop()
  public wish: number; //	想看的人数
}
