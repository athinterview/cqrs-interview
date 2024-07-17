import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';

export function methodNotAllowed(...allowedMethods: string[]) {
  return (req: Request, res: Response) => {
    res
      .status(405)
      .header('Allow', allowedMethods.join(', '))
      .send({
        message: 'Method Not Allowed',
      });
  };
}

/**
 * Handles promise rejection and invoke error handler
 * Needed until express 5.0
 * @param handler
 */
export function asyncRoute(handler: (_req: Request, _res: Response, _next: NextFunction) => Promise<void>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  }
}