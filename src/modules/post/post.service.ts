import { json } from 'node:stream/consumers';
import { CommentStatus, PostStatus } from '../../../generated/prisma/enums';
import { PostWhereInput } from '../../../generated/prisma/models';
import { prisma } from '../../lib/prisma';
import { ICreatePost, IPostQuery, IUpdatePostPayload } from './post.interface';

const createPostInDB = async (payload: ICreatePost, userId: string) => {
   const result = await prisma.post.create({
      data: {
         ...payload,
         authorId: userId,
      },
   });

   console.log(result);

   return result;
};

const getAllPostsFromDb = async (query: IPostQuery) => {
   console.log('QUery=======', query);

   const limit = query.limit ? Number(query.limit) : 10;
   const page = query.page ? Number(query.page) : 1;
   const skip = (page - 1) * limit;
   const sortBy = query.sortBy ? query.sortBy : 'createdAt';
   const sortOrder = query.sortOrder ? query.sortOrder : 'desc';

   const tags = query.tags ? JSON.parse(query.tags as string) : null;

   const tagsArray = Array.isArray(tags) ? tags : [];

   console.log(tagsArray);

   const andCondition: PostWhereInput[] = [];

   if (query.searchTerm) {
      andCondition.push({
         OR: [
            {
               title: {
                  contains: query.searchTerm,
                  mode: 'insensitive',
               },
            },
            {
               content: {
                  contains: query.searchTerm,
                  mode: 'insensitive',
               },
            },
         ],
      });
   }

   if (query.title) {
      andCondition.push({ title: query.title });
   }

   if (query.content) {
      andCondition.push({ content: query.content });
   }

   if (query.authorId) {
      andCondition.push({ authorId: query.authorId });
   }

   if (query.isFeatured) {
      andCondition.push({ isFeatured: Boolean(query.isFeatured) });
   }

   if (query.tags) {
      andCondition.push({
         tags: {
            hasSome: tagsArray,
         },
      });
   }

   if (query.status) {
      andCondition.push({
         status: query.status,
      });
   }

   const posts = await prisma.post.findMany({
      // ? Dynamic Searching and filtering
      // where: {
      //    AND: [
      //       query.searchTerm
      //          ? {
      //               OR: [
      //                  {
      //                     title: {
      //                        contains: query.searchTerm,
      //                        mode: 'insensitive',
      //                     },
      //                  },
      //                  {
      //                     content: {
      //                        contains: query.searchTerm,
      //                        mode: 'insensitive',
      //                     },
      //                  },
      //               ],
      //            }
      //          : {},

      //       query.title ? { title: query.title } : {},
      //       query.content ? { content: query.content } : {},
      //    ],
      // },

      where: {
         AND: andCondition,
      },

      take: limit,
      skip: skip,

      orderBy: {
         [sortBy]: sortOrder,
      },

      include: {
         author: {
            select: {
               email: true,
            },
         },
         comments: {
            select: {
               content: true,
            },
         },
      },
   });

   return posts;
};

const getMyPostsFromDB = async (authorId: string) => {
   console.log(authorId);
   const result = await prisma.post.findMany({
      where: {
         authorId,
      },
      orderBy: {
         createdAt: 'desc',
      },
      include: {
         comments: true,
         author: {
            omit: { password: true },
         },

         _count: {
            select: {
               comments: true,
            },
         },
      },
   });

   return result;
};

const getPostsByIdIntoDB = async (postId: string) => {
   // await prisma.post.update({
   //    where: { id: postId },
   //    data: {
   //       views: {
   //          increment: 1,
   //       },
   //    },
   //    include: {
   //       author: {
   //          omit: { password: true },
   //       },
   //       comments: true,
   //    },
   // });

   // const post = await prisma.post.findFirstOrThrow({
   //    where: {
   //       id: postId,
   //    },

   //    include: {
   //       author: {
   //          omit: { password: true },
   //       },
   //       comments: {
   //          where: {
   //             status: CommentStatus.APPROVED,
   //          },
   //          orderBy: {
   //             createdAt: 'desc',
   //          },
   //       },
   //       _count: {
   //          select: {
   //             comments: true,
   //          },
   //       },
   //    },
   // });

   // * Best Approch
   const transactionResult = await prisma.$transaction(async (tx) => {
      // Update post view
      await tx.post.update({
         where: { id: postId },
         data: {
            views: {
               increment: 1,
            },
         },
         include: {
            author: {
               omit: { password: true },
            },
            comments: true,
         },
      });

      // throw new Error('fake error');

      //
      const post = await tx.post.findFirstOrThrow({
         where: {
            id: postId,
         },

         include: {
            author: {
               omit: { password: true },
            },
            comments: {
               where: {
                  status: CommentStatus.APPROVED,
               },
               orderBy: {
                  createdAt: 'desc',
               },
            },
            _count: {
               select: {
                  comments: true,
               },
            },
         },
      });

      return post;
   });

   return transactionResult;
};

const updatePostIntoDB = async (
   postId: string,
   payload: IUpdatePostPayload,
   authorId: string,
   isAdmin: boolean
) => {
   const post = await prisma.post.findFirstOrThrow({
      where: {
         id: postId,
      },
   });

   if (!isAdmin && post.authorId !== authorId) {
      throw new Error('You are not the ownwe this post!');
   }

   const result = await prisma.post.update({
      where: { id: postId },
      data: payload,
   });

   return result;
};

const deletePostIntoDB = async (
   postId: string,
   authorId: string,
   isAdmin: boolean
) => {
   const post = await prisma.post.findFirstOrThrow({
      where: {
         id: postId,
      },
   });

   if (!isAdmin && post.authorId !== authorId) {
      throw new Error('You are not the owner this post!');
   }

   await prisma.post.delete({
      where: { id: postId },
   });

   return null;
};

const getPostsStatsFromDB = async () => {
   const transactionResult = await prisma.$transaction(async (tx) => {
      const [
         totalPosts,
         totalArchivedPosts,
         totalPublishedPosts,
         totalDraftPosts,
         totalComments,
         totalApprovedComments,
         totalRejectComments,
         totalPostViewCounts,
      ] = await Promise.all([
         await tx.post.count(),
         await tx.post.count({
            where: {
               status: PostStatus.PUBLISHED,
            },
         }),

         await tx.post.count({
            where: {
               status: PostStatus.DRAFT,
            },
         }),

         await tx.post.count({
            where: {
               status: PostStatus.ARCHIVED,
            },
         }),
         await tx.comment.count(),
         await tx.comment.count({
            where: {
               status: CommentStatus.APPROVED,
            },
         }),
         await tx.comment.count({
            where: {
               status: CommentStatus.REJECT,
            },
         }),

         await tx.post.aggregate({
            _sum: {
               views: true,
            },
         }),
      ]);

      return {
         totalPosts,
         totalArchivedPosts,
         totalPublishedPosts,
         totalDraftPosts,
         totalComments,
         totalApprovedComments,
         totalRejectComments,
         totalPostViews: totalPostViewCounts._sum.views,
      };
   });

   return transactionResult;
};

export const postService = {
   getAllPostsFromDb,
   getPostsStatsFromDB,
   getMyPostsFromDB,
   getPostsByIdIntoDB,
   createPostInDB,
   updatePostIntoDB,
   deletePostIntoDB,
};
