import express, { Express, Request, Response } from 'express';
import { pinoHttp } from 'pino-http';
import { createCQRS } from './logic/cqrs';
import { createDB } from './logic/db';
import { CommandExecutor } from './cqrs/command';
import { createProductsRouter } from './routes/products';
import { ObjectDataError, ObjectNotFoundError, ObjectValidationError } from './logic/errors';
import { createOrdersRouter } from './routes/orders';

export async function createApp(port: number, dbPath: string) {
  const db = await createDB(dbPath);
  const executor = createCQRS(db);
  return createExpress(executor);
}

export function createExpress(executor: CommandExecutor): Express {
  const app = express();

  app.use(pinoHttp());
  app.use(express.json());

  app.use('/products', createProductsRouter(executor));
  app.use('/orders', createOrdersRouter(executor));

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });

  app.use(defaultErrorHandler);
  return app;
}

export function defaultErrorHandler(error: Error, req: Request, res: Response, next: Function) {
  console.log('Default error handler')
  if (!(error instanceof ObjectDataError)) {
    res.status(500).json({error: 'An internal error occurred'});
    return;
  }

  if (error instanceof ObjectNotFoundError) {
    res.status(404).json({error: error.message});
  } else if (error instanceof ObjectValidationError) {
    res.status(400).json({error: error.message});
  } else if (error instanceof ObjectDataError) {
    res.status(422).json({error: error.message});
  } else {
    res.status(500).json({error: 'An unknown error occurred'});
  }
}
