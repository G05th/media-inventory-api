import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { LogModule } from './log/log.module'
import { MediaModule } from './media/media.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        // Usamos a variável de ambiente que configuramos no README
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MediaModule,
    LogModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
