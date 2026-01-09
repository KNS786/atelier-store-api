import { Schema, model, Types } from 'mongoose';

const paymentSchema = new Schema(
  {
    order: { type: Types.ObjectId, ref: 'Order', required: true },
    user: { type: Types.ObjectId, ref: 'User', required: true },

    gateway: { type: String, default: 'PAYU' },
    txnId: { type: String, unique: true },
    amount: Number,

    status: {
      type: String,
      enum: ['SUCCESS', 'FAILED', 'PENDING'],
      default: 'PENDING'
    },

    payuResponse: Schema.Types.Mixed
  },
  { timestamps: true }
);

export const Payment = model('Payment', paymentSchema);
