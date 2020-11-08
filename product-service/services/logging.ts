import * as winston from 'winston';

export const logger = winston.createLogger({
  format: winston.format.json(),
  defaultMeta: { service: 'product-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  ],
});
