import { Router } from 'express';
import * as controller from '../controllers/cart.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

router.use(auth); 

router.get('/', controller.getCart);
router.post('/', controller.addItem);
router.put('/', controller.updateItem);
router.delete('/item/:productId', controller.removeItem);
router.delete('/clear', controller.clear);

export default router;
