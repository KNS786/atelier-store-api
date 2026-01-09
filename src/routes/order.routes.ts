import { Router } from 'express';
import * as controller from '../controllers/order.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.use(auth);
router.post('/', controller.createOrder);
router.get('/', controller.getMyOrders);

router.get('/:id', controller.getOrder);

export default router;
