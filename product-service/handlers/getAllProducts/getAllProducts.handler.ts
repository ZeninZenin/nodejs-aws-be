import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Connection } from 'typeorm';
import { CORS_HEADERS } from '../../constants';
import { Database } from '../../data-access';
import { logger } from '../../services';
import { handleInternalError } from '../../utils';

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

    return handleInternalError(err);
  }

  try {
    const products = await connection.manager.query(
      `SELECT * FROM products p LEFT JOIN (SELECT count, "productId" AS id FROM stocks) s ON p.id = s.id`,
    );

    result = JSON.stringify(products);
  } catch (err) {
    connection.close();

    return handleInternalError(err);
  }

  connection.close();

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: result,
  };
};
