import { Body, Post, UseGuards, UseInterceptors } from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwtAuth.guards";
import { LoggingInterceptor } from "../log/interceptors/logging.interceptor";
import { CreateMediaDto } from "./dto/create-media.dto";
import { MediaService } from "./media.service";

export abstract class BaseMediaController {
  constructor(protected readonly mediaService: MediaService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(LoggingInterceptor)
  async create(@Body() createMediaDto: CreateMediaDto) {
    const actotId = "60c72b9f9b1d8e0015f8e5b4";
    createMediaDto.createdBy = actotId;
    createMediaDto.updatedBy = actotId;

    return this.mediaService.create(createMediaDto);
  }
}
