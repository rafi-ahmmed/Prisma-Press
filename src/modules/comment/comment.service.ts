import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../../lib/prisma';
import {
   ICreateCommentPayload,
   IUpdateCommentPayloadByAdmin,
   IUpdateCommentPayloadByUser,
} from './comment.interface';
import { CommentStatus, ROLE } from '../../../generated/prisma/enums';

const createComment = async (
   authorId: string,
   payload: ICreateCommentPayload
) => {
   const { content, postId } = payload;

   const post = await prisma.post.findUniqueOrThrow({
      where: { id: postId },
   });

   const comment = await prisma.comment.create({
      data: {
         content,
         postId,
         authorId,
      },
      include: {
         post: true,
      },
   });

   return comment;
};

const getCommentByAuthorId = async (authorId: string) => {
   const comments = await prisma.comment.findMany({
      where: { authorId },
      include: {
         author: {
            omit: {
               password: true,
            },
         },
      },
   });

   if (comments.length === 0) {
      throw new Error('Comments not found');
   }

   return comments;
};

const getCommentByCommentId = async (commentId: string) => {
   const result = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
      include: {
         author: {
            omit: { password: true },
         },
      },
   });

   return result;
};

const updateComment = async (
   commentId: string,
   isAdmin: boolean,
   authorId: string,
   payload: IUpdateCommentPayloadByUser
) => {
   const comment = await prisma.comment.findUniqueOrThrow({
      where: {
         id: commentId,
      },
   });

   if (!isAdmin && comment.authorId !== authorId) {
      throw new Error('You are not the owner this Comment!');
   }

   const updateResult = await prisma.comment.update({
      where: { id: commentId },
      data: {
         ...payload,
      },
   });

   return updateResult;
};

const deleteComment = async (
   commentId: string,
   isAdmin: boolean,
   authorId: string
) => {
   const comment = await prisma.comment.findUniqueOrThrow({
      where: { id: commentId },
   });

   if (!isAdmin && comment.authorId !== authorId) {
      throw new Error('You are not the owner this Comment!');
   }

   const result = await prisma.comment.delete({
      where: { id: commentId },
   });

   return result;
};

const updateCommentByAdmin = async (
   commentId: string,
   payload: IUpdateCommentPayloadByAdmin
) => {
   const comment = await prisma.comment.findUniqueOrThrow({
      where: {
         id: commentId,
      },
   });

   const updatedCommentStatus = await prisma.comment.update({
      where: {
         id: commentId,
      },
      data: {
         status: payload.status,
      },
   });

   return updatedCommentStatus;
};

export const commentService = {
   createComment,
   getCommentByAuthorId,
   getCommentByCommentId,
   updateComment,
   deleteComment,
   updateCommentByAdmin,
};
