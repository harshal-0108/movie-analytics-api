import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {

  const app =
    await NestFactory.create(
      AppModule,
    );

    async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ---------------- SWAGGER CONFIG ----------------
  const config = new DocumentBuilder()
    .setTitle('Movie Analytics API')
    .setDescription('API for movies, users, analytics')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);


  // ---------------- START SERVER ----------------
  await app.listen(3001);
}
bootstrap();

    app.use(helmet());

   app.enableCors({
  origin: 'http://localhost:5173',
});

  const config =
    new DocumentBuilder()
      .setTitle(
        'Movie Analytics API',
      )
      .setDescription(
        'API for Movies',
      )
      .setVersion('1.0')
      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api',
    app,
    document,
  );

 await app.listen(
  process.env.PORT || 3000,
);

}
bootstrap();