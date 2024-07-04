import 'dotenv/config';
import express, { Request, Response } from 'express';
import passport from 'passport';
import AuthController from '../controllers/auth.controller';

const router = express.Router();

const DEFAULT_REDIRECT = process.env.AUTH_REDIRECT as string;

const authController = new AuthController();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }),
);
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    failureRedirect: DEFAULT_REDIRECT,
  }),
  authController.redirect.bind(authController),
);
router.get('/login', (_req: Request, res: Response) => {
  res.redirect(`/api/auth/login/${encodeURIComponent(DEFAULT_REDIRECT)}`);
});
router.get('/login/:redirectUrl', authController.login.bind(authController));
router.get('/logout', authController.logout.bind(authController));

export default router;
