import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getProductById } from './getProductById.handler';

test('Returns a single product', async () => {
  const res = (await getProductById(
    ({ pathParameters: { id: '0' } } as unknown) as APIGatewayProxyEvent,
    null,
    null,
  )) as APIGatewayProxyResult;

  expect(res.statusCode).toBe(200);
  expect(res.body).toHaveProperty('id');
  expect(res.body).toHaveProperty('name');
  expect(res.body).toHaveProperty('count');
  expect(res.body).toHaveProperty('price');
});

test('Returns a 404 error', async () => {
  const res = (await getProductById(
    ({ pathParameters: { id: '2b4g916c42210-41ae-af78-c84b2079a7be' } } as unknown) as APIGatewayProxyEvent,
    null,
    null,
  )) as APIGatewayProxyResult;
  expect(res.body).toBe('2b4g916c42210-41ae-af78-c84b2079a7be');
});

test('Returns a validation error', async () => {
  const res = (await getProductById(
    ({ pathParameters: { id: 'a' } } as unknown) as APIGatewayProxyEvent,
    null,
    null,
  )) as APIGatewayProxyResult;
  expect(res.body).toBe('ID is incorrect');
});
