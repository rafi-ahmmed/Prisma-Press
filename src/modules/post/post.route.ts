import { Router } from 'express';
import { postController } from './post.controller';
import auth from '../../middlewares/auth';
import { ROLE } from '../../../generated/prisma/enums';

const router = Router();

router.post('/', auth(ROLE.USER, ROLE.ADMIN), postController.createPost);

router.get(
   '/',
   auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
   postController.getAllPosts
);

router.get('/stats', auth(ROLE.ADMIN), postController.getPostsStats);

router.get('/my-posts', auth(ROLE.USER, ROLE.ADMIN), postController.getMyPosts);

router.get(
   '/:postId',
   auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
   postController.getPostsById
);

router.patch(
   '/:postId',
   auth(ROLE.USER, ROLE.ADMIN),
   postController.updatePost
);
router.delete(
   '/:postId',
   auth(ROLE.USER, ROLE.ADMIN, ROLE.AUTHOR),
   postController.deletePost
);

export const postRoute = router;
