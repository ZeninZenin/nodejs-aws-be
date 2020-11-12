import { Product, Stock } from '../entities';
import { Database } from './Database';
import { INITIAL_PRODUCTS } from './DBInitialData';

(async () => {
  const db = new Database({
    host: 'rss-nodejs-aws-db.cgffwusdruom.eu-west-1.rds.amazonaws.com',
    port: 5432,
    username: 'postgres',
    database: 'rss_nodejs_aws',
    password: process.env.PG_PASS,
  });
  const connection = await db.connect();
  const productRepository = connection.getRepository(Product);
  const stockRepository = connection.getRepository(Stock);

  await stockRepository.delete({});
  await productRepository.delete({});

  const products = await productRepository.save(INITIAL_PRODUCTS);

  const stocks = await Promise.all(
    products.map(async product => {
      const stock = new Stock();
      stock.count = Math.floor(Math.random() * 10);
      stock.product = product;

      return stock;
    }),
  );

  await stockRepository.save(stocks);
  await connection.close();
})();
