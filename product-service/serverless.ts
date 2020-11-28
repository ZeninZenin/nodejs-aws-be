import type { Serverless } from 'serverless/aws';
import { IMPORT_SERVICE_SQS_QUEUE_ARN_OUT_NAME, SERVICE_NAME } from './constants';

export const serverlessConfiguration: Serverless = {
  service: {
    name: SERVICE_NAME,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: {
        forceInclude: ['pg'],
      },
    },
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    stage: 'dev',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      PG_HOST: 'rss-nodejs-aws-db.cgffwusdruom.eu-west-1.rds.amazonaws.com',
      PG_PORT: 5432,
      PG_DB: 'rss_nodejs_aws',
      PG_USER: 'postgres',
      PG_PASS: process.env.PG_PASS,
    },
  },
  functions: {
    getAllProducts: {
      handler: 'handler.getAllProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          },
        },
      ],
    },
    getProductById: {
      handler: 'handler.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: true,
          },
        },
      ],
    },
    addProduct: {
      handler: 'handler.addProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          },
        },
      ],
    },
    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            batchSize: 5,
            arn: {
              'Fn::ImportValue': IMPORT_SERVICE_SQS_QUEUE_ARN_OUT_NAME,
            },
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
