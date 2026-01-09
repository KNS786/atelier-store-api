import { Router } from 'express';
import { auth } from '../middlewares/auth.middleware';
import { initiatePayment } from '../controllers/payment.controller';
import { payuFailure, payuSuccess } from '../controllers/payment.callback';

const router = Router();

// router.post('/payu', auth, initiatePayment);

router.post('/payu', auth, initiatePayment);


// router.post('/payu/success', payuSuccess);
// router.post('/payu/failure', payuFailure);

export default router;
