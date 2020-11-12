import { APIGatewayProxyResult } from 'aws-lambda';
import { CORS_HEADERS } from '../constants';
import { logger } from '../services';

export const handleInternalError = (error: unknown): APIGatewayProxyResult => {
  logger.error(error);

  return {
    statusCode: 500,
    headers: CORS_HEADERS,
    body: 'Internal Service Error',
  };
};
