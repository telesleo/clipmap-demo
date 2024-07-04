import 'dotenv/config';
import express, { Request, Response } from 'express';
import passport from 'passport';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import './config/passport';
import { errorHandler } from './middlewares/errorHandler';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import mapRoutes from './routes/map.routes';
import getOriginList from './utils/get-origin-list';

const SESSION_KEY = process.env.SESSION_KEY as string;

const app = express();

const originWhitelist = getOriginList();

const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (origin == undefined || originWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 500,
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

app.use(bodyParser.json());
app.use(
  cookieSession({
    name: 'session',
    keys: [SESSION_KEY],
    // days - hours - minutes - seconds - milliseconds
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }),
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/api/', (_req: Request, res: Response) => res.send(':)'));
app.use('/api/auth', authRoutes);
app.use('/api/user', cors(corsOptions), userRoutes);
app.use('/api/map', cors(corsOptions), mapRoutes);

app.use(errorHandler);

export default app;
