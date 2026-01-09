import crypto from 'crypto';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';

export const payuSuccess = async (req: any, res: any) => {
  const {
    status,
    txnid,
    amount,
    productinfo,
    firstname,
    email,
    hash
  } = req.body;

  const hashString =
    `${process.env.PAYU_SALT}|${status}|||||||||||` +
    `${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_KEY}`;

  const generatedHash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');

  if (hash !== generatedHash) {
    return res.status(400).send('Invalid hash');
  }

  const orderId = productinfo.split('_')[1];

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).send('Order not found');

  const payment = await Payment.create({
    order: order._id,
    user: order.user,
    txnId: txnid,
    amount,
    status: 'SUCCESS',
    payuResponse: req.body
  });

  order.status = 'PAID';
  order.payment = payment._id;
  await order.save();

  res.redirect(`${process.env.FRONTEND_URL}/payment-success`);
};



export const payuFailure = async (req: any, res: any) => {
  const { txnid, amount, productinfo } = req.body;

  const orderId = productinfo.split('_')[1];
  const order = await Order.findById(orderId);

  if (order) {
    await Payment.create({
      order: order._id,
      user: order.user,
      txnId: txnid,
      amount,
      status: 'FAILED',
      payuResponse: req.body
    });
  }

  res.redirect(`${process.env.FRONTEND_URL}/payment-failed`);
};
