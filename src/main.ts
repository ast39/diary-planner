import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const APP_PORT = process.env.APP_PORT || 3000;
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(APP_PORT, () =>
    console.log(`APP started on port ${APP_PORT}`),
  );
}
bootstrap();
