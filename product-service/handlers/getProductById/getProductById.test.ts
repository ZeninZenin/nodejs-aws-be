import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getProductById } from './getProductById.handler';

test('Returns a single product', async () => {
  const res = await getProductById(({ pathParameters: { id: '0' } } as unknown) as APIGatewayProxyEvent, null, null);
  expect((res as APIGatewayProxyResult).body).toBe(
    '{"name":"Green Lightsaber","price":750,"imgUrl":"https://images-na.ssl-images-amazon.com/images/I/41YsZiuMvrL._AC_SX425_.jpg","id":"0"}',
  );
});

test('Returns a 404 error', async () => {
  const res = await getProductById(({ pathParameters: { id: '-1' } } as unknown) as APIGatewayProxyEvent, null, null);
  expect((res as APIGatewayProxyResult).body).toBe('A product with id: -1 is not found');
});

test('Returns a validation error', async () => {
  const res = await getProductById(({ pathParameters: { id: 'a' } } as unknown) as APIGatewayProxyEvent, null, null);
  expect((res as APIGatewayProxyResult).body).toBe('ID must be a number');
});
