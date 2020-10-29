import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { PRODUCTS_MOCK } from '../mockData';

export const getProductById: APIGatewayProxyHandler = async ({ pathParameters }) => {
  const hit = PRODUCTS_MOCK.find(({ id }) => pathParameters.id === id);

  if (!hit) {
    return {
      statusCode: 404,
      body: `A product with id: ${pathParameters.id} is not found`,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(hit),
  };
};
