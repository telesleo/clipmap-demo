import User from '../database/models/User';
import IServiceResponse from '../interfaces/IServiceResponse';

const USER_NOT_FOUND_MESSAGE = 'User not found';
const USER_DELETED_MESSAGE = 'User deleted';

export { USER_NOT_FOUND_MESSAGE, USER_DELETED_MESSAGE };

export default class UserService {
  constructor(private model: typeof User) {}

  async delete(userId: string): Promise<IServiceResponse> {
    const user = await this.model.findOne({ where: { id: userId } });
    if (!user) {
      return { status: 404, data: { message: USER_NOT_FOUND_MESSAGE } };
    }
    await this.model.destroy({ where: { id: userId } });
    return { status: 200, data: { message: USER_DELETED_MESSAGE } };
  }
}
