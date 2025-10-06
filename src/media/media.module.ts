// src/media/media.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'; // Importe MongooseModule
import { LogModule } from '../log/log.module';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { NewsController } from './news.controller';
import { Media, MediaSchema } from './schemas/media.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    LogModule,
  ],
  controllers: [MediaController, NewsController],
  providers: [MediaService],
})
export class MediaModule {}
