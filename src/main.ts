import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';

async function bootstrap() {
  try {
    dotenv.config();
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ extended: true, limit: '50mb' }));

    const corsOptions = {
      origin: [
        'http://127.0.0.1:5001/empire-310ba/us-central1/api',
        'http://localhost:4000',
      ],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization',
      optionsSuccessStatus: 200,
    };

    app.use(cors(corsOptions));
    const port = process.env.PORT || 4000;
    await app.listen(port);
    //await app.listen(process.env.PORT || 4000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Error during bootstrap:', error);
  }
}
bootstrap();
