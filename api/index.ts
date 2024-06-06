// import { NestFactory } from '@nestjs/core';
// import { AppModule } from '../src/app.module';
// import { ExpressAdapter } from '@nestjs/platform-express';
// import * as express from 'express';
// import { VercelRequest, VercelResponse } from '@vercel/node';

// const server = express();

// const createNestServer = async (expressInstance: express.Express) => {
//   const app = await NestFactory.create(
//     AppModule,
//     new ExpressAdapter(expressInstance),
//   );
//   app.enableCors();
//   await app.init();
//   return app;
// };

// let app;

// createNestServer(server)
//   .then((nestApp) => {
//     app = nestApp;
//     console.log('Nest application initialized');
//   })
//   .catch((err) => {
//     console.error('Nest application initialization failed', err);
//   });

// export default async (req: VercelRequest, res: VercelResponse) => {
//   if (!app) {
//     res.status(500).send('Server is not ready');
//     return;
//   }
//   try {
//     await app.getHttpAdapter().getInstance().handle(req, res);
//   } catch (err) {
//     console.error('Error handling request', err);
//     res.status(500).send('Internal Server Error');
//   }
// };
