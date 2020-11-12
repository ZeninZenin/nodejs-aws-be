import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Connection } from 'typeorm';
import { CORS_HEADERS } from '../../constants';
import { Database } from '../../data-access';
import { Product } from '../../entities';
import { logger } from '../../services';
import { handleInternalError } from '../../utils';

export const getProductById: APIGatewayProxyHandler = async ({ pathParameters }) => {
  process.on('uncaughtException', err => {
    logger.error(err);
  });

  const { id } = pathParameters;
  logger.info(`getProductById(); id=${id}`);

  if (id?.length !== 36) {
    return {
      statusCode: 400,
      headers: CORS_HEADERS,
      body: `ID is incorrect`,
    };
  }

  let connection: Connection;
  let hit: Product;

  try {
    const db = new Database();
    connection = await db.connect();

    hit = (
      await connection.manager.query(
        `SELECT * 
      FROM products p 
      LEFT JOIN 
        (SELECT count, "productId" AS id FROM stocks) s 
      ON p.id = s.id 
      WHERE p.id = '${id}';`,
      )
    )?.[0];

    connection.close();
  } catch (err) {
    connection?.close();

    return handleInternalError(err);
  }

  if (!hit) {
    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: `A product with id: ${pathParameters.id} is not found`,
    };
  }

  let result: string;

  try {
    result = JSON.stringify(hit);
  } catch (err) {
    return handleInternalError(err);
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: result,
  };
};
