import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserTokenDocument = HydratedDocument<UserToken>;

@Schema()
export class UserToken {
  @Prop()
  id: string;

  @Prop()
  name: string;

  @Prop()
  token: string;

  @Prop()
  email: string;
}

export const UserTokenSchema = SchemaFactory.createForClass(UserToken);
