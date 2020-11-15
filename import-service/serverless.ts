import type { Serverless } from 'serverless/aws';
import { BUCKET_NAME } from './constants';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: ['arn:aws:s3:::rss-nodejs-aws-import-service'],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: ['arn:aws:s3:::rss-nodejs-aws-import-service/*'],
      },
    ],
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            request: {
              parameters: {
                querystrings: {
                  name: true,
                },
              },
            },
            cors: true,
          },
        },
      ],
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: BUCKET_NAME,
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: 'uploaded/',
                suffix: '',
              },
            ],
            existing: true,
          },
        },
      ],
    },
  },
  resources: {
    Resources: {
      WebAppS3Bucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: 'rss-nodejs-aws-import-service',
          AccessControl: 'PublicRead',
        },
      },
      WebAppS3BucketPolicy: {
        Type: 'AWS::S3::BucketPolicy',
        Properties: {
          Bucket: {
            Ref: 'WebAppS3Bucket',
          },

          PolicyDocument: {
            Statement: [
              {
                Sid: 'AllowPublicRead',
                Effect: 'Allow',
                Principal: { AWS: '*' },
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::rss-nodejs-aws-import-service/*',
              },
            ],
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
