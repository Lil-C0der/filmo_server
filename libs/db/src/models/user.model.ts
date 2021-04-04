import { prop } from '@typegoose/typegoose';

export class User {
  @prop()
  public username: string;
  @prop()
  public pwd: string;
}
