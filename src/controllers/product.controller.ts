import { Request, Response } from 'express';
import * as productService from '../services/product.service';

export const create = async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);
  res.status(201).json(product);
};


export const findAll = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;

  const result = await productService.getPaginatedProducts(
    page,
    limit,
    search,
    category
  );

  res.json(result);
};

export const findOne = async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
};

export const update = async (req: Request, res: Response) => {
  const product = await productService.updateProduct(
    req.params.id,
    req.body
  );
  res.json(product);
};

export const remove = async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id);
  res.json({ message: 'Product deleted successfully' });
};
