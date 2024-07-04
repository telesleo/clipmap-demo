import { NextFunction, Request, Response } from 'express';
import UserService from '../services/user.service';

export default class UserController {
  constructor(private service: UserService) {}

  async getUserData(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json(req.user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id as string;
      const { status, data } = await this.service.delete(userId);
      res.status(status).json(data);
    } catch (error) {
      next(error);
    }
  }
}
