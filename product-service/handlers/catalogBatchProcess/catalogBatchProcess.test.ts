import { Product, Stock } from '../../entities';
import { getProductCreationData, validateCreationData } from './utils';

test('Returns a product creation data', () => {
  const { newProduct, newStock } = getProductCreationData('{"name":"name1","price": 500,"imgUrl": "#", "count": 5}');

  expect(newProduct).toBeInstanceOf(Product);
  expect(newProduct).toHaveProperty('name', 'name1');
  expect(newProduct).toHaveProperty('price', 500);
  expect(newProduct).toHaveProperty('imgUrl', '#');

  expect(newStock).toBeInstanceOf(Stock);
  expect(newStock).toHaveProperty('count', 5);
});

test('Validate a product creation data and return void', async () => {
  const creationData = getProductCreationData('{"name":"name1","price": 500,"imgUrl": "#", "count": 5}');
  const validationErrors = await validateCreationData(creationData);

  expect(validationErrors).toHaveLength(0);
});

test('Validate a product creation data and return validation errors', async () => {
  const creationData = getProductCreationData('{"price": 500,"imgUrl": "#"}');
  const validationErrors = await validateCreationData(creationData);

  expect(validationErrors).toBeInstanceOf(Array);
});
