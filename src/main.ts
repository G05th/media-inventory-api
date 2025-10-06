import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove props que não existem no DTO
      transform: true, // aplica class-transformer antes da validação
      transformOptions: {
        enableImplicitConversion: true, // converte tipos primitivos automaticamente (opcional)
      },
      // forbidNonWhitelisted: true,  // descomente se quiser rejeitar requests com campos extras
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
