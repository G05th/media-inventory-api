import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

@Injectable()
export class LogService {
  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {}

  async saveLog(logData: {
    action: string;
    mediaAssetId: string;
    actorId: string;
    details?: any;
  }): Promise<LogDocument | null> {
    try {
      const newLog = new this.logModel(logData);
      return await newLog.save();
    } catch (err) {
      console.error('Erro ao salvar log', err);
      return null;
    }
  }
}
