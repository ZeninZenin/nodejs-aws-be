import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Connection } from 'typeorm';
import { Database } from '../../data-access';
import { Product } from '../../entities';
import { logger } from '../../services';

export const getProductById: APIGatewayProxyHandler = async ({ pathParameters }) => {
  process.on('uncaughtException', err => {
    logger.error(err);
  });

  const { id } = pathParameters;
  logger.info(`getProductById(); id=${id}`);

  if (id?.length !== 36) {
    return {
      statusCode: 400,
      body: `ID is incorrect`,
    };
  }

  let connection: Connection;
  let hit: Product;

  try {
    const db = new Database();
    connection = await db.connect();

    hit = await connection.manager.query(
      `SELECT * 
      FROM products p 
      LEFT JOIN 
        (SELECT count, "productId" AS id FROM stocks) s 
      ON p.id = s.id 
      WHERE p.id = '${id}';`,
    )?.[0];

    connection.close();
  } catch (err) {
    connection?.close();
    logger.error(err);

    return {
      statusCode: 500,
      body: 'Internal Service Error',
    };
  }

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
    logger.error(err);

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
