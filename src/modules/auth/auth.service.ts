import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma';
import { ILoginUser } from './auth.interface';
import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import config from '../../config';
import { jwtUtils } from '../../utils/jwt';

const loginUser = async (payload: ILoginUser) => {
   const { email, password } = payload;

   const user = await prisma.user.findUniqueOrThrow({
      where: { email },
   });

   if (user.activeStatus === 'BLOCKED') {
      throw new Error('Your Account has bin blocked. Please Contact support!');
   }

   const isPasswordMatch = await bcrypt.compare(password, user.password);

   if (!isPasswordMatch) {
      throw new Error('Password is Incorrect!');
   }

   const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
   };

   const accessToken = jwtUtils.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in as SignOptions
   );

   const refreshToken = jwtUtils.createToken(
      jwtPayload,
      config.jwt_refresh_secret,
      config.jwt_refresh_expires_in as SignOptions
   );

   return { accessToken, refreshToken };
};

const refreshToken = async (refreshToken: string) => {
   const verifiedToken = jwtUtils.verifyToken(
      refreshToken,
      config.jwt_refresh_secret
   );

   if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
   }

   const { id, name, email, role } = verifiedToken.data as JwtPayload;

   const user = await prisma.user.findUniqueOrThrow({ where: { id } });

   if (user.activeStatus === 'BLOCKED') {
      throw new Error('User is blocked');
   }

   const jwtPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
   };

   const accessToken = jwtUtils.createToken(
      jwtPayload,
      config.jwt_access_secret,
      config.jwt_access_expires_in as SignOptions
   );

   return { accessToken };
};

export const authService = {
   loginUser,
   refreshToken,
};
