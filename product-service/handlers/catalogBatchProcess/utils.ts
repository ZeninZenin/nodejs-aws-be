import { validate, ValidationError } from 'class-validator';
import { Product, Stock } from '../../entities';
import { ProductCreationBody } from '../../types';
import { ProductCreationData } from './catalogBatchProcess.types';

export const getProductCreationData = (recordBody: string): ProductCreationData => {
  const { count, ...product } = JSON.parse(recordBody) as ProductCreationBody;
  const newProduct = new Product();
  const newStock = new Stock();

  Object.keys(product).forEach(key => {
    const value = product[key];

    if (key === 'price') {
      newProduct[key] = +value;
    } else {
      newProduct[key] = value;
    }
  });

  newStock.count = +count;

  return {
    newProduct,
    newStock,
  };
};

export const validateCreationData = async ({
  newProduct,
  newStock,
}: ProductCreationData): Promise<ValidationError[]> => {
  return [
    ...(await validate(newProduct, { validationError: { target: false } })),
    ...(await validate(newStock, { validationError: { target: false } })),
  ];
};
