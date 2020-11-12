import { Connection, createConnection } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { Product, Stock } from '../entities';
import { logger } from '../services';

export class Database {
  private connection: Connection;
  private options: PostgresConnectionOptions;

  constructor(options: Omit<PostgresConnectionOptions, 'type'> = {}) {
    this.options = {
      type: 'postgres',
      host: process.env.PG_HOST,
      port: parseInt(process.env.PORT) || 5432,
      username: process.env.PG_USER || 'postgres',
      password: process.env.PG_PASS,
      database: process.env.PG_DB,
      entities: [Product, Stock],
      uuidExtension: 'uuid-ossp',
      synchronize: true,
      logging: false,
      ...options,
    };
  }

  connect = async (): Promise<Connection> => {
    logger.info(`Try to connect to ${process.env.PG_DB} database`);

    try {
      this.connection = await createConnection(this.options);
      logger.info(`Connected to ${process.env.PG_DB} database`);

      return this.connection;
    } catch (error) {
      logger.error(`Connection to ${process.env.PG_DB} database is failed.`);
      logger.error(error);

      return error;
    }
  };

  public getConnection(): Connection | undefined {
    logger.info('Database.getConnection()');

    return this.connection;
  }
}
