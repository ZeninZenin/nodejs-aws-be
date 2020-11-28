import { SQSHandler } from 'aws-lambda';
import { Connection } from 'typeorm';
import { Database } from '../../data-access';
import { Product, Stock } from '../../entities';
import { logger } from '../../services';
import { ProductsCreationResult } from '../../types';
import { ProductCreationData } from './catalogBatchProcess.types';
import { getProductCreationData, validateCreationData } from './utils';

export const catalogBatchProcess: SQSHandler = async ({ Records }) => {
  process.on('uncaughtException', err => {
    logger.error(err);
  });
  logger.info(`catalogBatchProcess(); Records: ${JSON.stringify(Records)}`);

  const result = await Promise.allSettled<Promise<ProductsCreationResult>>(
    Records.map(async ({ body }) => {
      let connection: Connection;
      let creationData: ProductCreationData;

      try {
        creationData = getProductCreationData(body);
      } catch (error) {
        return {
          success: false,
          body,
          error,
        };
      }

      try {
        const validationErrors = await validateCreationData(creationData);

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
        const { newStock, newProduct } = creationData;
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
