import { APIGatewayProxyHandler } from 'aws-lambda';
import { validate } from 'class-validator';
import { Connection } from 'typeorm';
import { CORS_HEADERS } from '../../constants';
import { Database } from '../../data-access';
import { Product, Stock } from '../../entities';
import { logger } from '../../services';
import { ProductCreationBody } from '../../types';
import { handleInternalError } from '../../utils';

export const addProduct: APIGatewayProxyHandler = async ({ body }) => {
  process.on('uncaughtException', err => {
    logger.error(err);
  });
  logger.info(`addProduct(); body: ${body}`);

  let parsedBody: ProductCreationBody;
  let connection: Connection;
  let newProduct = new Product();
  const newStock = new Stock();

  try {
    parsedBody = JSON.parse(body);
    const { count, ...product } = parsedBody;

    Object.keys(product).forEach(key => (newProduct[key] = product[key]));
    newStock.count = count;
  } catch (err) {
    return handleInternalError(err);
  }

  const db = new Database();

  try {
    const validationErrors = [
      ...(await validate(newProduct, { validationError: { target: false } })),
      ...(await validate(newStock, { validationError: { target: false } })),
    ];

    if (validationErrors.length > 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify(validationErrors),
      };
    }
  } catch (err) {
    return handleInternalError(err);
  }

  try {
    connection = await db.connect();

    await connection.transaction(async transactionalEntityManager => {
      await transactionalEntityManager.save(newProduct);
      newProduct = await transactionalEntityManager.findOne(Product, { where: [{ name: newProduct.name }] });
      newStock.product = newProduct;
      await transactionalEntityManager.save(Stock, newStock);
    });

    connection.close();
  } catch (err) {
    connection?.close();

    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: err?.detail || JSON.stringify(err),
    };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: newProduct.id,
  };
};
