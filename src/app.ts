import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { userController } from './modules/user/user.controller';
import { authController } from './modules/auth/auth.controller';
import { userRoutes } from './modules/user/user.route';
import { authRoute } from './modules/auth/auth.route';

const app: Application = express();

// Middlewares
app.use(
   cors({
      origin: config.app_url,
      credentials: true,
   })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', async (req: Request, res: Response) => {
   res.send('Hello world');
});

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoute);

export default app;
