import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { PRODUCTS_MOCK } from '../mockData';

export const getAllProducts: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Required for CORS support to work
    },
    body: JSON.stringify(PRODUCTS_MOCK),
  };
};
