import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { importProductsFile } from './importProductsFile.handler';

test('Should return signed URL', async () => {
  const result = (await importProductsFile(
    ({
      queryStringParameters: { name: 'test.csv' },
    } as unknown) as APIGatewayProxyEvent,
    null,
    null,
  )) as APIGatewayProxyResult;

  console.log({ result });

  expect(result.statusCode).toBe(200);
});
