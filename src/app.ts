import express from 'express';
import cors from 'cors';

import  authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes';
import orderRoutes from './routes/order.routes'
import paymentRoutes from './routes/payment.routes';
import paymentCallbackRoutes from './routes/payment.callback.routes'


const app = express();

app.use(cors());

// PayU sends POST form data → urlencoded is REQUIRED
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/cart', cartRoutes);
app.use("/api/orders", orderRoutes)
app.use("/api/payment", paymentRoutes)

app.use('/api/payment', paymentCallbackRoutes);


export default app;