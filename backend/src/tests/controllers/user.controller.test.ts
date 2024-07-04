import { NextFunction, Request, Response } from 'express';
import User from '../../database/models/User';
import UserService, { USER_DELETED_MESSAGE } from '../../services/user.service';
import * as userMock from '../mocks/user.mock';
import UserController from '../../controllers/user.controller';

describe('UserController', () => {
  let userService: jest.Mocked<UserService>;
  let userController: UserController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    userService = {
      delete: jest.fn(),
    } as Partial<UserService> as jest.Mocked<UserService>;
    userController = new UserController(userService);
    req = {
      user: userMock.users[0] as User,
      params: {},
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getUserData', () => {
    it('Should return user data', async () => {
      await userController.getUserData(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith(userMock.users[0]);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('delete', () => {
    it('Should delete a user', async () => {
      userService.delete.mockResolvedValue({
        status: 200,
        data: { message: USER_DELETED_MESSAGE },
      });

      await userController.delete(req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ message: USER_DELETED_MESSAGE });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
