import { NextFunction, Request, Response } from 'express';
import checkAuth from '../../middlewares/checkAuth';
import * as userMock from '../mocks/user.mock';
import User from '../../database/models/User';

describe('checkAuth', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      sendStatus: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('Should call next if user is valid', () => {
    req.user = userMock.users[0] as User;
    checkAuth(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it('Should return error when user is invalid', () => {
    checkAuth(req as Request, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
