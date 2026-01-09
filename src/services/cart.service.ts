import { cart } from "../models/cart.model";
import { Types } from "mongoose";


export const getCartByUser = async (userId: string) => {
  try {
    let carts = await cart.findOne({ user: userId }).populate('items.product');
    
    if (!carts) {
      // Create new cart if doesn't exist
      carts = await cart.create({ user: userId, items: [] });
    }
    
    return {
      success: true,
      data: carts
    };

  } catch (error: any) {
    throw new Error(`Failed to get cart: ${error.message}`);
  }
};

export const addToCart = async (userId: string, productId: string, quantity: number ) => {
    let carts = await cart.findOne({ user: userId });
    console.log("carts::::=>", carts);

    // new cart
    if(!carts){
        carts = await cart.create({
            user: userId,
            items: [
                {
                    product: productId,
                    quantity
                }
            ]
        });
        return carts;
    }

        console.log("cartsss222s::::=>", carts);


    // check if the already existsing cart add the quantity
    let itemIndex = carts.items.findIndex((item) => item.product?.toString() == productId );

    console.log("itemIndex ::::", itemIndex);

    if(itemIndex > - 1){
        carts.items[itemIndex].quantity = quantity;
    }
    else{
        carts.items.push({ product: productId, quantity })
    }
    
    await carts.save();
}

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  const carts = await cart.findOne({ user: userId });
  if (!carts) throw new Error('Cart not found');

  const item = carts?.items.find(
    item => item.product?.toString() == productId
  );
  if (!item) throw new Error('Product not in cart');

  item.quantity = quantity;
  await carts?.save();

  return carts;
};

export const removeCartItem = async (
  userId: string,
  productId: string
) => {
  const carts = await cart.findOneAndUpdate(
    { user: userId },
    {
      $pull: {
        items: { product: productId }
      }
    },
    { new: true }
  );

  if (!carts) {
    throw new Error('Cart not found');
  }

  return carts;
};

export const clearCart = async (userId: string) => {
  return cart.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { new: true }
  );
};