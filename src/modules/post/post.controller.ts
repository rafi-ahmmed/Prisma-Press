import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { postService } from './post.service';
import { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';

const createPost = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.user as JwtPayload;

      const payload = req.body;

      const result = await postService.createPostInDB(payload, id);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'Post Created Successfully!',
         data: result,
      });
   }
);

const getAllPosts = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
      // console.log(query);

      const posts = await postService.getAllPostsFromDb(query);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'All posts Successfully retreive!',
         data: posts,
      });
   }
);

const getPostsById = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const id = req.params.postId;

      if (!id) {
         throw new Error('Post id required in params!');
      }

      const result = await postService.getPostsByIdIntoDB(id as string);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'Post retrieve successfully!',
         data: result,
      });
   }
);

const getPostsStats = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const result = await postService.getPostsStatsFromDB();

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'Stats retrieve successfully!',
         data: result,
      });
   }
);

const getMyPosts = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id;

      console.log(authorId);

      const result = await postService.getMyPostsFromDB(authorId as string);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'Post retrieve successfully!',
         data: result,
      });
   }
);

const updatePost = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';

      const postId = req.params.postId as string;
      const payload = req.body;

      if (!postId) {
         throw new Error('Post id required');
      }

      const result = await postService.updatePostIntoDB(
         postId,
         payload,
         authorId as string,
         isAdmin
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'Post updated successfully!',
         data: result,
      });
   }
);

const deletePost = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';
      const postId = req.params.postId as string;

      if (!postId) {
         throw new Error('Post id required');
      }

      await postService.deletePostIntoDB(postId, authorId as string, isAdmin);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'Post Deleted successfully!',
         data: null,
      });
   }
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
