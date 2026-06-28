import { Router } from 'express';
import { commentController } from './comment.controller';
import auth from '../../middlewares/auth';
import { ROLE } from '../../../generated/prisma/enums';

const router = Router();

router.post('/', auth(ROLE.USER, ROLE.ADMIN), commentController.createComment);
router.get('/author/:authorId', commentController.getCommentByAuthorId);
router.get('/:commentId', commentController.getCommentByCommentId);
router.patch(
   '/:commentId',
   auth(ROLE.USER, ROLE.ADMIN),
   commentController.updateComment
);
router.delete(
   '/:commentId',
   auth(ROLE.USER, ROLE.ADMIN),
   commentController.deleteComment
);
router.patch(
   '/:commentId/moderate',
   auth(ROLE.ADMIN),
   commentController.updateCommentByAdmin
);

export const commentRoute = router;
