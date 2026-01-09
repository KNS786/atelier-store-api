import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { initiatePayment } from '../controllers/payment.controller';

const router = Router();

router.post('/payu', auth, initiatePayment);

export default router;
