import { Schema, model, Document, Types } from 'mongoose';

interface IShippingAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface IOrderItem {
  product: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  user: Types.ObjectId;

  // 🔐 snapshot user data
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  shippingAddress: IShippingAddress;

  items: IOrderItem[];
  totalAmount: number;
  status: 'PLACED' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

const shippingAddressSchema = new Schema<IShippingAddress>(
  {
    addressLine1: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  { _id: false }
);

// const orderSchema = new Schema<IOrder>(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: 'User',
//       required: true
//     },

//     firstName: { type: String, required: true },
//     lastName: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },

//     shippingAddress: {
//       type: shippingAddressSchema,
//       required: true
//     },

//     items: [
//       {
//         product: {
//           type: Schema.Types.ObjectId,
//           ref: 'Product',
//           required: true
//         },
//         quantity: { type: Number, required: true },
//         price: { type: Number, required: true }
//       }
//     ],

//     totalAmount: { type: Number, required: true },

//    payment: {
//       type: Types.ObjectId,
//       ref: 'Payment'
//     },

//     status: {
//       type: String,
//       enum: ['PLACED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
//       default: 'PLACED'
//     }
//   },
//   { timestamps: true }
// );


const orderSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: 'User', required: true },

    firstName: String,
    lastName: String,
    email: String,
    phone: String,

    shippingAddress: {
      addressLine1: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },

    items: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        quantity: Number,
        price: Number
      }
    ],

    totalAmount: Number,

    status: {
      type: String,
      enum: ['PLACED', 'PAID', 'CANCELLED'],
      default: 'PLACED'
    },

    payment: {
      type: Types.ObjectId,
      ref: 'Payment'
    }
  },
  { timestamps: true }
);

export const Order = model('Order', orderSchema);
