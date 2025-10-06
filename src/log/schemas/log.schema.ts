import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as Mongoose from 'mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

@Schema({ timestamps: true })
export class Log {
  //O que aconteceu
  @Prop({ required: true, index: true })
  action: string;

  //A que ativo a acção se aplica
  @Prop({ required: true, type: Mongoose.Schema.Types.ObjectId, ref: 'Media' })
  mediaAssetId: Mongoose.Schema.Types.ObjectId;

  //Quem fez a Acção
  @Prop({ type: Mongoose.Schema.Types.ObjectId, required: true, ref: 'User' })
  actorId: Mongoose.Schema.Types.ObjectId;

  //Detalhes da Accção realizada
  @Prop({ type: Mongoose.Schema.Types.Mixed })
  details: any;
}

export const LogSchema = SchemaFactory.createForClass(Log);
