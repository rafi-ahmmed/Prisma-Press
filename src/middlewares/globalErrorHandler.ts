import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Prisma } from '../../generated/prisma/client';
import { PrismaClientUnknownRequestError } from '../../generated/prisma/internal/prismaNamespace';

export const globalErrorHandler = (
   err: any,
   req: Request,
   res: Response,
   next: NextFunction
) => {
   console.log('Error', err);

   let statusCode;
   let errorMessage = err.message || 'Internal Server Error';
   let errorName = err.name || 'Internal Server Error';
   // let errorDetails = err.stack;

   if (err instanceof Prisma.PrismaClientValidationError) {
      statusCode = httpStatus.BAD_REQUEST;
      errorMessage = 'You have provided incorrect field type or missing fields';
   } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
         ((statusCode = httpStatus.BAD_REQUEST),
            (errorMessage = 'Duplicate key error'));
      } else if (err.code === 'P2003') {
         ((statusCode = httpStatus.BAD_REQUEST),
            (errorMessage = 'Foreign key constraints failed'));
      } else if (err.code == 'P2025') {
         statusCode = httpStatus.BAD_REQUEST;
         errorMessage =
            'An operation failed because it depends on one or more records that were required but not found. {cause}';
      }
   } else if (err instanceof Prisma.PrismaClientInitializationError) {
      if (err.errorCode === 'P1000') {
         statusCode = httpStatus.UNAUTHORIZED;
         errorMessage =
            'Authentication failed against database server at {database_host}, the provided database credentials for {database_user} are not valid';
      } else if ((err.errorCode = '1001')) {
         statusCode = httpStatus.BAD_REQUEST;
         errorMessage =
            "Can't reach database server at {database_host}:{database_port}";
      }
   } else if (err instanceof PrismaClientUnknownRequestError) {
      ((statusCode = httpStatus.INTERNAL_SERVER_ERROR),
         (errorMessage = 'Error occurred during execution'));
   }

   res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
      name: errorName,
      message: errorMessage,
      error: err.stack,
   });
};
