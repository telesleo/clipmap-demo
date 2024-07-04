import { NextFunction, Request, Response } from 'express';
import { errorHandler } from '../../middlewares/errorHandler';
import { INTERNAL_SERVER_ERROR_MESSAGE } from '../../utils/response-messages';

describe('checkAuth', () => {
  let err: Error;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    err = {} as Error;
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('Should return a server error', () => {
    errorHandler(err, req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: INTERNAL_SERVER_ERROR_MESSAGE,
    });
  });
});
