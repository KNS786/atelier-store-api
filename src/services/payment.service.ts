import crypto from 'crypto';
import { Order } from '../models/order.model';

export const initiatePayUPayment = async (
  orderId: string,
  userId: string
) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  console.log("order found ::::", order)
  if (!order) throw new Error('Order not found');

  const txnId = `TXN_${Date.now()}`;

  const hashString =
    `${process.env.PAYU_KEY}|${txnId}|${order.totalAmount}|Order_${order._id}|` +
    `${order.firstName}|${order.email}|||||||||||${process.env.PAYU_SALT}`;

  const hash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');

  return {
    payuUrl: process.env.PAYU_BASE_URL,
    params: {
      key: process.env.PAYU_KEY,
      txnid: txnId,
      amount: order.totalAmount,
      productinfo: `Order_${order._id}`,
      firstname: order.firstName,
      email: order.email,
      phone: order.phone,
      surl: `${process.env.APP_URL}/api/payment/payu/success`,
      furl: `${process.env.APP_URL}/api/payment/payu/failure`,
      hash
    }
  };
};
