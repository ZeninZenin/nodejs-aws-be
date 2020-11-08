import { APIGatewayProxyResult } from 'aws-lambda';
import { getAllProducts } from './getAllProducts.handler';

test('Returns a products list', async () => {
  const res = (await getAllProducts(null, null, null)) as APIGatewayProxyResult;
  expect(res.statusCode).toBe(200);

  const parsedBody = JSON.parse(res.body);

  expect(parsedBody).toBeInstanceOf(Array);
  expect(parsedBody[0]).toHaveProperty('id');
  expect(parsedBody[0]).toHaveProperty('name');
  expect(parsedBody[0]).toHaveProperty('count');
  expect(parsedBody[0]).toHaveProperty('price');
});
