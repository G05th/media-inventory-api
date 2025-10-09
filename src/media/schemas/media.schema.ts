import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as Mongoose from "mongoose";


export type MediaDocument = Media & Document;
@Schema({ timestamps: true })
export class Media {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true, enum: ["VIDEOS", "NEWS"] })
  type: string;

  @Prop()
  actor?: string;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, required: true })
  createdBy: Mongoose.Schema.Types.ObjectId;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, required: true })
  updatedBy: Mongoose.Schema.Types.ObjectId;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
