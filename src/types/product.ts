// src/types/product.ts
export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageURL?: string;
  stockQuantity: number;
  supplier: string;
  expiryDate?: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
  productCount: number;
  isActive: boolean;
  description: string;
}
