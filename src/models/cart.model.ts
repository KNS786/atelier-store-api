import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
         required: true,
      unique: true
    },
    items: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
             required: true,
      unique: true
        },
        quantity: { type: Number,  required: true,
      unique: true}
    }]
}, { timestamps: true });

export const cart = model('Cart', cartSchema);