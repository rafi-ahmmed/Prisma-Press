import { NextFunction, Request, Response } from 'express';
import { ROLE } from '../../generated/prisma/enums';
import catchAsync from '../utils/catchAsync';
import { jwtUtils } from '../utils/jwt';
import config from '../config';
import { JwtPayload } from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

declare global {
   namespace Express {
      interface Request {
         user?: {
            email: string;
            id: string;
            name: string;
            role: ROLE;
         };
      }
   }
}

const auth = (...requiredRoles: ROLE[]) => {
   return catchAsync(
      async (req: Request, res: Response, next: NextFunction) => {
         console.log('auth middleware hit');
         const token = req.cookies.accessToken
            ? req.cookies.accessToken
            : req.headers.authorization?.startsWith('Bearer ')
              ? req.headers.authorization?.split(' ')[1]
              : req.headers.authorization;

         //? Verify is token has or not
         if (!token) {
            throw new Error(
               'You are not logged in..Please logged in to access the resource!'
            );
         }

         //? Verify token
         const verifiedToken = jwtUtils.verifyToken(
            token,
            config.jwt_access_secret
         );

         //? is token is valid or not
         if (!verifiedToken.success) {
            throw new Error(verifiedToken.error);
         }

         const { id, name, email, role } = verifiedToken.data as JwtPayload;

         //? is role is mached or not
         if (requiredRoles.length && !requiredRoles.includes(role)) {
            throw new Error(
               'Forbidden . U dont have permission to access this rosource'
            );
         }

         // Find user in database
         const user = await prisma.user.findUnique({
            where: {
               id,
               email,
               name,
            },
         });

         //? Is user exist or not
         if (!user) {
            throw new Error('User not found!');
         }

         //? is usEr active or not
         if (user.activeStatus === 'BLOCKED') {
            throw new Error(
               'Your Account has bin blocked. Please Contact support!'
            );
         }

         req.user = {
            id,
            email,
            name,
            role,
         };
         next();
      }
   );
};

export default auth;
