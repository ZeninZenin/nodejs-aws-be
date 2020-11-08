import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Connection } from 'typeorm';
import { Database } from '../../data-access';
import { logger } from '../../services';

export const getAllProducts: APIGatewayProxyHandler = async () => {
  process.on('uncaughtException', err => {
    logger.error(err);
  });
  logger.info('getAllProducts()');

  let result: string;
  let connection: Connection;

  try {
    const db = new Database();
    connection = await db.connect();
  } catch (err) {
    connection?.close();

    return {
      statusCode: 500,
      body: 'Internal Service Error',
    };
  }

  try {
    const products = await connection.manager.query(
      `SELECT * FROM products p LEFT JOIN (SELECT count, "productId" AS id FROM stocks) s ON p.id = s.id`,
    );

    result = JSON.stringify(products);
  } catch (err) {
    logger.error(err);
    connection.close();

    return {
      statusCode: 500,
      body: 'Internal Service Error',
    };
  }

  connection.close();

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: result,
  };
};
