import { Router } from 'express';
import { subscriptionController } from './subscription.controller';
import auth from '../../middlewares/auth';
import { ROLE } from '../../../generated/prisma/enums';

const router = Router();

router.post(
   '/checkout',
   auth(ROLE.USER, ROLE.AUTHOR, ROLE.ADMIN),
   subscriptionController.createCheckoutSession
);

export const SubscriptionRouter = router;
