import { Request, Response, NextFunction } from 'express';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '../utils/response-messages';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error('An error occurred:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({ message: INTERNAL_SERVER_ERROR_MESSAGE });
}
