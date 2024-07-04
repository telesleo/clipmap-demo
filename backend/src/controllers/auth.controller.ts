import 'dotenv/config';
import { Request, Response } from 'express';
import getOriginList from '../utils/get-origin-list';

const DEFAULT_REDIRECT = process.env.AUTH_REDIRECT as string;

export default class AuthController {
  constructor() {}

  authenticate() {}

  redirect(req: Request, res: Response) {
    const redirectUrl =
      (req.session?.redirectUrl as string) || DEFAULT_REDIRECT;
    res.redirect(redirectUrl);
  }

  login(req: Request, res: Response) {
    const originWhitelist = getOriginList();
    const { redirectUrl } = req.params;
    const redirectUrlObj = new URL(redirectUrl);
    if (!originWhitelist.includes(redirectUrlObj.origin)) {
      res.status(401).json({ message: 'RedirectUrl is invalid' });
      return;
    }
    if (req.user) {
      res.redirect(redirectUrl);
      return;
    }
    if (req.session) {
      req.session.redirectUrl = redirectUrl;
    }
    res.redirect('/api/auth/google');
  }

  logout(req: Request, res: Response) {
    req.logout(() => {});
    res.redirect(DEFAULT_REDIRECT);
  }
}
