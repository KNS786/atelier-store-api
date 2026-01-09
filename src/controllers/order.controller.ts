import { Request, Response } from 'express';
import * as orderService from '../services/order.service';

export const createOrder = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const order = await orderService.createOrderFromCart(
    userId,
    req.body
  );

  res.status(201).json(order);
};


/**
 * GET /api/orders
 * Get logged-in user's orders
 */
export const getMyOrders = async (req: Request, res: Response) => {
  const userId = req.user.id;

  const orders = await orderService.getMyOrders(userId);
  res.json(orders);
};

/**
 * GET /api/orders/:id
 * Get single order by ID
 */
export const getOrder = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const orderId = req.params.id;

  const order = await orderService.getOrderById(orderId, userId);

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  res.json(order);
};