import express from 'express';
import cors from 'cors';
import { apiRouter } from './routes/index.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createServer() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:4200' }));
  app.use(express.json());

  app.use('/api', apiRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

