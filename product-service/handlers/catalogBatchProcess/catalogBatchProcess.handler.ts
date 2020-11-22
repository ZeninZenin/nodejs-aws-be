import { SQSHandler } from 'aws-lambda';
import { validate } from 'class-validator';
import { Connection } from 'typeorm';
import { Database } from '../../data-access';
import { Product, Stock } from '../../entities';
import { logger } from '../../services';
import { ProductCreationBody, ProductsCreationResult } from '../../types';

export const catalogBatchProcess: SQSHandler = async ({ Records }) => {
  process.on('uncaughtException', err => {
    logger.error(err);
  });
  logger.info(`catalogBatchProcess(); Records: ${JSON.stringify(Records)}`);

  const result = await Promise.allSettled<Promise<ProductsCreationResult>>(
    Records.map(async ({ body }) => {
      let connection: Connection;
      let parsedBody: ProductCreationBody;
      const newProduct = new Product();
      const newStock = new Stock();

      try {
        parsedBody = JSON.parse(body);
        const { count, ...product } = parsedBody;

        Object.keys(product).forEach(key => {
          const value = product[key];

          if (key === 'price') {
            newProduct[key] = +value;
          } else {
            newProduct[key] = value;
          }
        });
        newStock.count = +count;
      } catch (error) {
        return {
          success: false,
          body,
          error,
        };
      }

      try {
        const validationErrors = [
          ...(await validate(newProduct, { validationError: { target: false } })),
          ...(await validate(newStock, { validationError: { target: false } })),
        ];

        if (validationErrors.length > 0) {
          return {
            success: false,
            body,
            error: JSON.stringify(validationErrors),
          };
        }
      } catch (error) {
        return {
          success: false,
          body,
          error,
        };
      }

      const db = new Database();

      try {
        connection = await db.connect();
        let newProductId: string;

        await connection.transaction(async transactionalEntityManager => {
          await transactionalEntityManager.save(newProduct);
          newProductId = (await transactionalEntityManager.findOne(Product, { where: [{ name: newProduct.name }] })).id;
          newStock.product = newProduct;
          await transactionalEntityManager.save(Stock, newStock);
        });

        connection.close();

        return {
          success: true,
          body: newProductId,
        };
      } catch (error) {
        connection?.close();

        return {
          success: false,
          body,
          error,
        };
      }
    }),
  );

  logger.info(`Products creation result: ${JSON.stringify(result)}`);
};
