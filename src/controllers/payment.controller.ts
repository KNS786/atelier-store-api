import { Request, Response } from 'express';
import { initiatePayUPayment } from '../services/payment.service';

// export const initiatePayment = async (req: Request, res: Response) => {
//   const userId = req.user.id;
//   const { orderId } = req.body;

//   const data = await initiatePayUPayment(orderId, userId);
//   res.json(data);
// };


export const initiatePayment = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    console.log('Initiating payment for order:', orderId, 'User:', userId);

    const paymentData = await initiatePayUPayment(orderId, userId);

    res.json({
      success: true,
      data: paymentData
    });
  } catch (error: any) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};