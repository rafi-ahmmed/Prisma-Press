import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';

const getAllPosts = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const getPostsStats = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const getMyPosts = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const getPostsById = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const createPost = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const updatePost = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

const deletePost = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {}
);

export const postController = {
   getAllPosts,
   getPostsStats,
   getMyPosts,
   getPostsById,
   createPost,
   updatePost,
   deletePost,
};
