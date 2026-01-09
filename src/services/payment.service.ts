import crypto from 'crypto';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';

export const initiatePayUPayment = async (
  orderId: string,
  userId: string,
) => {
  // Fetch order with user populated
  const order = await Order.findOne({ _id: orderId, user: userId }).populate('user');
  
  console.log("Order found:", order);
  
  if (!order) {
    throw new Error('Order not found');
  }

  // Get user details
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  // Extract and validate required fields
  const firstName = (order.firstName || user.name || 'Guest').trim();
  const email = (order.email || user.email || '').trim();
  const phone = (order.phone || "8848419258" || '').trim();
  const amount = parseFloat(order.totalAmount ? order.totalAmount.toString() : '0').toFixed(2);

  console.log('Payment Details:', { firstName, email, phone, amount });

  // Validate required fields
  if (!email) {
    throw new Error('Email is required. Please update your profile.');
  }

  if (!phone) {
    throw new Error('Phone number is required. Please update your profile.');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  // Phone validation (must be 10 digits)
  const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
  if (cleanPhone.length !== 10) {
    throw new Error('Phone number must be 10 digits');
  }

  const txnId = `TXN_${Date.now()}`;
  const productInfo = `ORDER_${orderId}`;

  // CRITICAL: PayU Hash Format - CONFIRMED WORKING
  // Format: key|txnid|amount|productinfo|firstname|email + 10 empty fields + salt
  // This creates 17 parts joined by 16 pipes
  
  const parts = [
    process.env.PAYU_KEY,      // 1. key
    txnId,                      // 2. txnid  
    amount,                     // 3. amount
    productInfo,                // 4. productinfo
    firstName,                  // 5. firstname
    email,                      // 6. email
    '',                         // 7. udf1
    '',                         // 8. udf2
    '',                         // 9. udf3
    '',                         // 10. udf4
    '',                         // 11. udf5
    '',                         // 12. empty field
    '',                         // 13. empty field
    '',                         // 14. empty field
    '',                         // 15. empty field
    '',                         // 16. empty field
    process.env.PAYU_SALT      // 17. salt
  ];
  
  const hashString = parts.join('|');
  const pipeCount = (hashString.match(/\|/g) || []).length;
  
  console.log('Hash String:', hashString);
  console.log('Pipe Count:', pipeCount); // Must be exactly 16
  console.log('Hash breakdown:');
  console.log(`  KEY: ${process.env.PAYU_KEY}`);
  console.log(`  TXNID: ${txnId}`);
  console.log(`  AMOUNT: ${amount}`);
  console.log(`  PRODUCT_INFO: ${productInfo}`);
  console.log(`  FIRSTNAME: ${firstName}`);
  console.log(`  EMAIL: ${email}`);
  console.log(`  UDF1-5: (empty)`);
  console.log(`  SALT: ${process.env.PAYU_SALT}`);

  const hash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('hex');

  console.log('Generated Hash (full):', hash);

  // Store txnId in order for verification later
  order.transactionId = txnId;
  await order.save();

  return {
    payuUrl: process.env.PAYU_BASE_URL,
    params: {
      key: process.env.PAYU_KEY,
      txnid: txnId,
      amount: amount,
      productinfo: productInfo,
      firstname: firstName,
      service_provider: 'payu_paisa',
      email: email,
      phone: cleanPhone,
      surl: `${process.env.APP_URL}/api/payment/payu/success`,
      furl: `${process.env.APP_URL}/api/payment/payu/failure`,
      hash: hash,
      udf1: '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: ''
    }
  };
};