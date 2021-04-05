import { ModelOptions, prop } from '@typegoose/typegoose';

@ModelOptions({
  schemaOptions: { timestamps: true }
})
export class User {
  @prop()
  public username: string;
  @prop()
  public pwd: string;
}
