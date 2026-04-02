import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Es crítico habilitar CORS para APIs consumidas por SPAs o móviles (Web).
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
