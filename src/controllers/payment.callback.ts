import crypto from 'crypto';
import { Order } from '../models/order.model';
import { Payment } from '../models/payment.model';

export const payuSuccess = async (req: any, res: any) => {
  try {
    const {
      status,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      hash,
      mihpayid,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = ''
    } = req.body;

    console.log('PayU Success Callback:', req.body);

    // CRITICAL: Reverse hash verification format
    // salt|status|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const hashString =
      `${process.env.PAYU_SALT}|${status}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.PAYU_KEY}`;

    const pipeCount = (hashString.match(/\|/g) || []).length;
    
    console.log('Verification Hash String:', hashString);
    console.log('Pipe Count:', pipeCount);

    const generatedHash = crypto
      .createHash('sha512')
      .update(hashString)
      .digest('hex');

    console.log('Generated Hash:', generatedHash);
    console.log('Received Hash:', hash);
    console.log('Hash Match:', generatedHash === hash);

    if (hash !== generatedHash) {
      console.error('Hash mismatch!');
      console.error('Expected hash format breakdown:');
      console.error(`  SALT: ${process.env.PAYU_SALT}`);
      console.error(`  STATUS: ${status}`);
      console.error(`  UDF5: ${udf5}`);
      console.error(`  UDF4: ${udf4}`);
      console.error(`  UDF3: ${udf3}`);
      console.error(`  UDF2: ${udf2}`);
      console.error(`  UDF1: ${udf1}`);
      console.error(`  EMAIL: ${email}`);
      console.error(`  FIRSTNAME: ${firstname}`);
      console.error(`  PRODUCT_INFO: ${productinfo}`);
      console.error(`  AMOUNT: ${amount}`);
      console.error(`  TXNID: ${txnid}`);
      console.error(`  KEY: ${process.env.PAYU_KEY}`);
      
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=hash_mismatch`);
    }

    // Extract orderId from productinfo
    const orderId = productinfo.split('_')[1];

    const order = await Order.findById(orderId);
    if (!order) {
      console.error('Order not found:', orderId);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=order_not_found`);
    }

    // Create payment record
    const payment = await Payment.create({
      order: order._id,
      user: order.user,
      txnId: txnid,
      amount,
      status: 'SUCCESS',
      payuResponse: req.body
    });

    // Update order status
    order.status = 'PAID';
    order.payment = payment._id;
    await order.save();

    console.log('Payment successful for order:', orderId);

    res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${orderId}&txnId=${txnid}`);
  } catch (error) {
    console.error('PayU Success Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=processing_error`);
  }
};

export const payuFailure = async (req: any, res: any) => {
  try {
    const { txnid, amount, productinfo, error_Message } = req.body;

    console.log('PayU Failure Callback:', req.body);

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

      console.log('Payment failed for order:', orderId);
    }

    res.redirect(`${process.env.FRONTEND_URL}/payment-failed?orderId=${orderId}&error=${encodeURIComponent(error_Message || 'Payment failed')}`);
  } catch (error) {
    console.error('PayU Failure Callback Error:', error);
    res.redirect(`${process.env.FRONTEND_URL}/payment-failed?error=processing_error`);
  }
};