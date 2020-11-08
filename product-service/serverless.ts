import type { Serverless } from 'serverless/aws';

export const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
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
  },
};

module.exports = serverlessConfiguration;
