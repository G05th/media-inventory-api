import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMediaDto } from './dto/create-media.dto';
import { Media, MediaDocument } from './schemas/media.schema';

type MediaType = 'VIDEO' | 'NEWS';

@Injectable()
export class MediaService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async create(createMediaDto: CreateMediaDto): Promise<MediaDocument> {
    const newMedia = new this.mediaModel(createMediaDto);
    return newMedia.save();
  }

  async findAll(type?: MediaType): Promise<MediaDocument[]> {
    const filter = type ? type : {};
    return this.mediaModel.find(filter).exec();
  }

  async remove(id: string): Promise<any> {
    return this.mediaModel.deleteOne({ _id: id }).exec();
  }
}
