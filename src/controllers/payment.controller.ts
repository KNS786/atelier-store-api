import { Request, Response } from 'express';
import { initiatePayUPayment } from '../services/payment.service';

export const initiatePayment = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { orderId } = req.body;

  const data = await initiatePayUPayment(orderId, userId);
  res.json(data);
};
