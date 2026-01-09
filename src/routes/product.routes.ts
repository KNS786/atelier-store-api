import { Router } from 'express';
import * as controller from '../controllers/product.controller';
import { auth } from '../middlewares/auth.middleware';

const router = Router();

// Public
router.get('/', controller.findAll);
router.get('/:id', controller.findOne);

// Protected (Admin)
router.post('/', auth, controller.create);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.remove);

export default router;
