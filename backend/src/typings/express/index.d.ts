import UserModel from '../../database/models/User';

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}
