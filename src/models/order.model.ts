import { Schema, model, Document, Types } from 'mongoose';

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  items: [],
  totalAmount: Number,
  status: { type: String, default: 'PLACED' }
}, { timestamps: true });

export const Order = model('Order', orderSchema);