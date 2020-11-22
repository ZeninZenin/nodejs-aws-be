import { Product, Stock } from '../entities';

export interface ProductMeta {
  name: string;
  price: number;
  imgUrl: string;
}

export interface ProductFull {
  name: string;
  price: number;
  imgUrl: string;
  id: string;
  count: number;
}

export type ProductCreationBody = Omit<Product & Stock, 'id' | 'productId' | 'product'>;

export interface ProductsCreationResult {
  success: boolean;
  body: string | ProductCreationBody;
  error?: string;
}
