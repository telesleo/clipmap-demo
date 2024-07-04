import User from '../../database/models/User';
import UserService, {
  USER_DELETED_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from '../../services/user.service';
import * as userMock from '../mocks/user.mock';

jest.mock('../../database/models/User', () => ({
  findOne: jest.fn(),
  destroy: jest.fn(),
}));

describe('User Service', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(User);
    jest.clearAllMocks();
  });

  describe('delete', () => {
    it('Should delete a user', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({ ...userMock.users[0] });

      const response = await userService.delete(userMock.users[0].id);
      expect(response.status).toBe(200);
      expect(response.data).toEqual({ message: USER_DELETED_MESSAGE });
    });

    it('Should return an error when user is not found', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const response = await userService.delete(userMock.invalidId);
      expect(response.status).toBe(404);
      expect(response.data).toEqual({ message: USER_NOT_FOUND_MESSAGE });
    });
  });
});
