import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';
import config from '../../config';
import { RegisterUserPayload } from './user.interface';

const registerUserIntoDB = async (payload: RegisterUserPayload) => {
   const { name, email, password, profilePhoto, bio } = payload;
   const isUserExist = await prisma.user.findUnique({
      where: { email },
   });

   if (isUserExist) {
      throw new Error('User with this email already Exist');
   }

   const hashedPass = await bcrypt.hash(
      password,
      Number(config.bcrypt_salt_rounds)
   );

   const createdUser = await prisma.user.create({
      data: {
         name,
         email,
         password: hashedPass,
         profile: {
            create: {
               profilePhoto,
               bio,
            },
         },
      },
   });

   // await prisma.profile.create({
   //    data: {
   //       userId: createdUser.id,
   //       profilePhoto,
   //       bio,
   //    },
   // });

   const user = await prisma.user.findUnique({
      where: {
         id: createdUser.id,
         email: createdUser.email || email,
      },
      omit: {
         password: true,
      },
      include: {
         profile: true,
      },
   });

   return user;
};

const getMyProfileFromDB = async (userId: string) => {
   const userProfile = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      omit: { password: true },
      include: {
         profile: true,
      },
   });

   return userProfile;
};

const updateMyProfileIntoDB = () => {};

export const userService = {
   registerUserIntoDB,
   getMyProfileFromDB,
   updateMyProfileIntoDB,
};
