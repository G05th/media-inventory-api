import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { LoggingInterceptor } from '../log/interceptors/logging.interceptor';
import { CreateMediaDto } from './dto/create-media.dto';
import { MediaService } from './media.service';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {} //<-- injeção de Media Service
  @Post()
  @UseInterceptors(LoggingInterceptor)
  async create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  async findAll() {
    return this.mediaService.findAll();
  }

  @Delete(':id')
  @UseInterceptors(LoggingInterceptor)
  async remove(@Param('id') id: string) {
    await this.mediaService.remove(id);

    return { message: 'Asset deleted successfully.' };
  }
}
