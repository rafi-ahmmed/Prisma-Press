import { Router } from 'express';
import { commentController } from './comment.controller';

const router = Router();

router.get('/author/:authorId', commentController.getCommentByAuthorId);
router.get('/:commentId', commentController.getCommentByCommentId);
router.post('/', commentController.createComment);
router.patch('/:commentId', commentController.updateComment);
router.delete('/:commentId', commentController.deleteComment);
router.patch('/:commentId/moderate', commentController.updateCommentByAdmin);

export const commentRoute = router;
