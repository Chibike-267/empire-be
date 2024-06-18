import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const server = express();

const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
  );
  app.enableCors();
  await app.init();
  return app;
};

let app;

createNestServer(server).then((nestApp) => {
  app = nestApp;
});

export default (req: VercelRequest, res: VercelResponse) => {
  app.getHttpAdapter().getInstance().handle(req, res);
};
