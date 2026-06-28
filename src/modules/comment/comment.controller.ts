import { NextFunction, Request, Response } from 'express';
import { commentService } from './comment.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { JwtPayload } from 'jsonwebtoken';
import { ROLE } from '../../../generated/prisma/enums';

const createComment = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.user?.id as string;
      const payload = req.body;

      const result = await commentService.createComment(authorId, payload);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.CREATED,
         message: 'Comment Posted Successfully',
         data: result,
      });
   }
);

const getCommentByAuthorId = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const authorId = req.params.authorId as string;

      const result = await commentService.getCommentByAuthorId(authorId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Comments retrieve Successfully',
         data: result,
      });
   }
);

const getCommentByCommentId = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const commentId = req.params.commentId as string;

      const result = await commentService.getCommentByCommentId(commentId);

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Comments retrieve Successfully',
         data: result,
      });
   }
);

const updateComment = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const commentId = req.params.commentId as string;
      const isAdmin = req.user?.role === ROLE.ADMIN;
      const authorId = req.user?.id as string;
      const payload = req.body;

      const result = await commentService.updateComment(
         commentId,
         isAdmin,
         authorId,
         payload
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Comments Updated Successfully',
         data: result,
      });
   }
);

const deleteComment = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const commentId = req.params.commentId as string;
      const isAdmin = req.user?.role === ROLE.ADMIN;
      const authorId = req.user?.id as string;

      const result = await commentService.deleteComment(
         commentId,
         isAdmin,
         authorId
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Comments Deleted Successfully',
         data: result,
      });
   }
);

const updateCommentByAdmin = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const commentId = req.params.commentId as string;
      const payload = req.body;
      const isAdmin = req.user?.role === ROLE.ADMIN;

      console.log(commentId);
      console.log(payload);

      const result = await commentService.updateCommentByAdmin(
         commentId,
         payload
      );

      sendResponse(res, {
         success: true,
         statusCode: httpStatus.OK,
         message: 'Comments Status Updated Successfully',
         data: result,
      });
   }
);

export const commentController = {
   getCommentByAuthorId,
   getCommentByCommentId,
   createComment,
   updateComment,
   deleteComment,
   updateCommentByAdmin,
};
