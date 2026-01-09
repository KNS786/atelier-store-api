import mongoose from 'mongoose';
import { Order } from '../models/order.model';
import { cart } from '../models/cart.model';
import { Product } from '../models/product.model';

export const createOrderFromCart = async (
  userId: string,
  payload: any
) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cartData = await cart.findOne({ user: userId })
      .populate('items.product')
      .session(session);

    if (!cartData || cartData.items.length === 0) {
      throw new Error('cartData is empty');
    }

    let totalAmount = 0;

    const orderItems = cartData.items.map((item: any) => {
      const product = item.product;

      if (product.stock < item.quantity) {
        throw new Error(`${product.name} is out of stock`);
      }

      totalAmount += product.price * item.quantity;

      return {
        product: product._id,
        quantity: item.quantity,
        price: product.price
      };
    });

    // // 🔻 Reduce product stock
    // for (const item of cartData.items as any[]) {
    //   await Product.updateOne(
    //     { _id: item.product._id },
    //     { $inc: { stock: -item.quantity } },
    //     { session }
    //   );
    // }

    const order = await Order.create(
      [
        {
          user: userId,
          ...payload, // 🔑 snapshot fields
          items: orderItems,
          totalAmount
        }
      ],
      { session }
    );

    // 🧹 Clear cart
    // await cart.updateOne(
    //   { user: userId },
    //   { $set: { items: [] } },
    //   { session }
    // );

    await session.commitTransaction();
    session.endSession();

    return order[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};



/**
 * Get all orders of logged-in user
 */
export const getMyOrders = async (userId: string) => {
  return Order.find({ user: userId })
    .populate('items.product', 'name price')
    .sort({ createdAt: -1 });
};

/**
 * Get single order by orderId (user-scoped)
 */
export const getOrderById = async (
  orderId: string,
  userId: string
) => {
  return Order.findOne({
    _id: orderId,
    user: userId
  }).populate('items.product', 'name price');
};