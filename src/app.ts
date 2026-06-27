import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config';
import { userRoutes } from './modules/user/user.route';
import { authRoute } from './modules/auth/auth.route';
import { postRoute } from './modules/post/post.route';
import { commentRoute } from './modules/comment/comment.route';

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
app.use('/api/posts', postRoute);
app.use('/api/comments', commentRoute);

export default app;
