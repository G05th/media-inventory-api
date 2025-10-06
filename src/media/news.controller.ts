import { Controller, Get } from '@nestjs/common';
import { BaseMediaController } from './base.controller';
import { MediaService } from './media.service';

@Controller('news')
export class NewsController extends BaseMediaController {
  constructor(mediaService: MediaService) {
    super(mediaService);
  }

  @Get()
  async findAllNews() {
    return this.mediaService.findAll('NEWS');
  }
}
