import { NextFunction, Request, Response } from 'express';

const getCommentByAuthorId = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {};

const getCommentByCommentId = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {};

const createComment = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {};

const updateComment = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {};

const deleteComment = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {};

const updateCommentByAdmin = async (
   req: Request,
   res: Response,
   next: NextFunction
) => {};

export const commentController = {
   getCommentByAuthorId,
   getCommentByCommentId,
   createComment,
   updateComment,
   deleteComment,
   updateCommentByAdmin,
};
