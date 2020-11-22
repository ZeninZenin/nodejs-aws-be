import { S3Handler } from 'aws-lambda';
import * as csvParser from 'csv-parser';
import { S3 } from 'aws-sdk';
import { logger } from '../services';
import { BUCKET_NAME } from '../constants';

export const importFileParser: S3Handler = async event => {
  logger.info('importFileParser()');
  const s3 = new S3({ region: 'eu-west-1' });

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
        .on('data', data => logger.info(data))
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
        .on('error', error => reject(error))
        .on('close', () => resolve());
    });
  });

  await Promise.all(promises);
};
