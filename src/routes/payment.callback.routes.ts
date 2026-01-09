import { Router } from 'express';
import { payuSuccess, payuFailure } from '../controllers/payment.callback';

const router = Router();

router.post('/payu/success', payuSuccess);
router.post('/payu/failure', payuFailure);

export default router;
