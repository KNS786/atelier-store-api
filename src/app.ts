import express from 'express';
import cors from 'cors';

import  authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes'
import cartRoutes from './routes/cart.routes';

const app = express();

app.use(cors());

app.use(express.json());

//routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use('/api/cart', cartRoutes);


export default app;