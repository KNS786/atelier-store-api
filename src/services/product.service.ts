import { Types } from "mongoose";
import { Product } from "../models/product.model";

export const createProduct = async (data: any) => {
    return Product.create(data);
}

export const getAllProducts = async () => {
    return Product.find({ isActive: true }).populate('category')
}

export const getProductById = async (id: string ) => {
    return Product.findById(id).populate("category")
}

export const updateProduct = async (
    id: string,
    data: any
) => {
    return Product.findByIdAndUpdate(id, data, { new: true })
}

export const deleteProduct = async (id: string) => {
    return Product.findByIdAndUpdate(
        id,
        { isActive: false },
        { new: true }
    )
}

export const getPaginatedProducts = async (
  page: number,
  limit: number,
  search?: string,
  category?: string
) => {
  const skip = (page - 1) * limit;

  const filter: any = { isActive: true };

  // Search by product name
  if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }

  // Filter by category
  if (category && Types.ObjectId.isValid(category)) {
    filter.category = category;
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),

    Product.countDocuments(filter)
  ]);

  return {
    data: products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};