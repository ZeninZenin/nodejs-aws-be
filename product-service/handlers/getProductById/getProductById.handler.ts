import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { PRODUCTS_MOCK } from '../../mockData';

export const getProductById: APIGatewayProxyHandler = async ({ pathParameters }) => {
  const { id } = pathParameters;

  if (isNaN(+id)) {
    return {
      statusCode: 400,
      body: `ID must be a number`,
    };
  }

  const hit = PRODUCTS_MOCK.find(product => product.id === id);

  if (!hit) {
    return {
      statusCode: 404,
      body: `A product with id: ${pathParameters.id} is not found`,
    };
  }

  let result: string;

  try {
    result = JSON.stringify(hit);
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,
      body: 'Internal Service Error',
    };
  }

  return {
    statusCode: 200,
    body: result,
  };
};
