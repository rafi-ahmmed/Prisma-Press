import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { prisma } from './lib/prisma';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import { userController } from './modules/user/user.controller';

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

app.use('/api/users', userController.registerUser);

export default app;
