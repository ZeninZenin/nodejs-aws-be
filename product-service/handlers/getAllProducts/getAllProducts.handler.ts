import { APIGatewayProxyHandler } from 'aws-lambda';
import fetch from 'node-fetch';
import 'source-map-support/register';
import { PRODUCTS_MOCK } from '../../mockData';
import { streamToString } from '../../utils';

export const getAllProducts: APIGatewayProxyHandler = async () => {
  let result: string;
  let factor = 0.013;

  try {
    const currencyRes = await fetch('https://api.exchangeratesapi.io/latest?base=RUB');
    const currency = await streamToString(currencyRes.body);
    factor = JSON.parse(currency).rates.USD;
  } catch (err) {
    console.log('Currency API isn`t working.');
    console.log(err);
  }

  try {
    result = JSON.stringify(PRODUCTS_MOCK.map(product => ({ ...product, price: product.price * factor })));
  } catch (err) {
    console.log(err);

    return {
      statusCode: 500,
      body: 'Internal Service Error',
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: result,
  };
};
