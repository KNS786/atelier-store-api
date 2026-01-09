import { Request, Response } from 'express';
import * as cartService from '../services/cart.service';

export const getCart = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const cart = await cartService.getCartByUser(userId);
  res.json(cart);
};

export const addItem = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cart = await cartService.addToCart(
    userId,
    productId,
    quantity
  );
  res.status(201).json(cart);
};

export const updateItem = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  const cart = await cartService.updateCartItem(
    userId,
    productId,
    quantity
  );
  res.json(cart);
};

export const removeItem = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const cart = await cartService.removeCartItem(userId, productId);
  res.json(cart);
};

export const clear = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const cart = await cartService.clearCart(userId);
  res.json(cart);
};


