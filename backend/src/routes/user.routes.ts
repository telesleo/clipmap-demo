import express from 'express';
import checkAuth from '../middlewares/checkAuth';
import UserService from '../services/user.service';
import User from '../database/models/User';
import UserController from '../controllers/user.controller';

const router = express.Router();

const userService = new UserService(User);
const userController = new UserController(userService);

router.get('/', checkAuth, userController.getUserData.bind(userController));
router.delete('/', checkAuth, userController.delete.bind(userController));

export default router;
