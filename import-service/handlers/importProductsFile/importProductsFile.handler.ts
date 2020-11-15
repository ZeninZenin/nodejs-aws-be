import { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import 'source-map-support/register';
import { BUCKET_NAME, CORS_HEADERS } from '../../constants';
import { logger } from '../../services';

export const importProductsFile: APIGatewayProxyHandler = async ({ queryStringParameters }) => {
  logger.info(`importProductsFile(); fileName: ${queryStringParameters.name}`);
  const s3 = new S3({ region: 'eu-west-1' });
  let statusCode: APIGatewayProxyResult['statusCode'] = 200;
  let signedUrl = '';

  const params = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${queryStringParameters.name}`,
    ContentType: 'text/csv',
  };

  try {
    signedUrl = await s3.getSignedUrlPromise('putObject', params);
  } catch (err) {
    logger.error(err);
    statusCode = 500;
  }

  return {
    statusCode,
    headers: CORS_HEADERS,
    body: signedUrl,
  };
};
