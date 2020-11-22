import { S3Handler } from 'aws-lambda';
import * as csvParser from 'csv-parser';
import { S3, SNS, SQS } from 'aws-sdk';
import { logger } from '../services';
import { BUCKET_NAME } from '../constants';

export const importFileParser: S3Handler = async event => {
  logger.info('importFileParser()');
  const s3 = new S3({ region: 'eu-west-1' });
  const sqs = new SQS({ region: 'eu-west-1' });
  const sns = new SNS({ region: 'eu-west-1' });

  const promises = event.Records.map(async record => {
    const KeyUploaded = record.s3.object.key;
    const KeyParsed = KeyUploaded.replace('uploaded', 'parsed');

    const stream = s3
      .getObject({
        Bucket: BUCKET_NAME,
        Key: KeyUploaded,
      })
      .createReadStream();

    return await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on('data', async data => {
          await sqs
            .sendMessage({
              QueueUrl: process.env.CREATE_PRODUCT_SQS_URL,
              MessageBody: JSON.stringify(data),
            })
            .promise();

          const message = `Send new product to product service: ${JSON.stringify(data)}`;
          logger.info(message);

          await sns
            .publish({
              Subject: 'New products',
              Message: message,
              TopicArn: process.env.CREATE_PRODUCT_SNS_ARN,
            })
            .promise();
        })
        .on('end', async () => {
          logger.info(`Copy from ${BUCKET_NAME}/${KeyUploaded}`);

          await s3
            .copyObject({
              Bucket: BUCKET_NAME,
              CopySource: `${BUCKET_NAME}/${KeyUploaded}`,
              Key: KeyParsed,
            })
            .promise();

          logger.info(`Copied into ${BUCKET_NAME}/${KeyParsed}`);

          await s3
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: KeyUploaded,
            })
            .promise();

          logger.info(`File ${BUCKET_NAME}/${KeyUploaded} has been deleted`);
        })
        .on('error', error => {
          logger.error(error);
          reject(error);
        })
        .on('close', () => resolve());
    });
  });

  await Promise.all(promises);
};
