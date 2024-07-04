import { NextFunction, Request, Response } from 'express';

export default function checkAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req?.user) {
    res.sendStatus(401);
    return;
  }
  next();
}
