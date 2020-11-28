import { Product, Stock } from '../../entities';

export interface ProductCreationData {
  newProduct: Product;
  newStock: Stock;
}
