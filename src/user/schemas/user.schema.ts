import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as bcrypt from "bcryptjs";
import { Document } from "mongoose";

interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type UserDocument = User & Document & IUserMethods;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

//Hook de segurança

UserSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(this.password, salt);
  this.password = hash;
  next();
});

UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
