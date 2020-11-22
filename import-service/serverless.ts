import type { Serverless } from 'serverless/aws';
import {
  BUCKET_NAME,
  SERVICE_NAME,
  SNS_TOPIC_LOCAL_NAME,
  SNS_TOPIC_NAME,
  SQS_QUEUE_LOCAL_NAME,
  SQS_QUEUE_NAME,
} from './constants';

const serverlessConfiguration: Serverless = {
  service: {
    name: SERVICE_NAME,
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
      CREATE_PRODUCT_SQS_URL: {
        Ref: SQS_QUEUE_LOCAL_NAME,
      },
      CREATE_PRODUCT_SNS_ARN: {
        Ref: SNS_TOPIC_LOCAL_NAME,
      },
    },
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: [`arn:aws:s3:::rss-nodejs-aws-${SERVICE_NAME}`],
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: [`arn:aws:s3:::rss-nodejs-aws-${SERVICE_NAME}/*`],
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        Resource: [
          {
            'Fn::GetAtt': [SQS_QUEUE_LOCAL_NAME, 'Arn'],
          },
        ],
      },
      {
        Effect: 'Allow',
        Action: 'sns:*',
        Resource: {
          Ref: SNS_TOPIC_LOCAL_NAME,
        },
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
          BucketName: `rss-nodejs-aws-${SERVICE_NAME}`,
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
                Resource: `arn:aws:s3:::rss-nodejs-aws-${SERVICE_NAME}/*`,
              },
            ],
          },
        },
      },
      [SQS_QUEUE_LOCAL_NAME]: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: SQS_QUEUE_NAME,
        },
      },
      [SNS_TOPIC_LOCAL_NAME]: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: SNS_TOPIC_NAME,
        },
      },
      SNSSubscriptionExpensiveProducts: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'zeninser@outlook.com',
          Protocol: 'email',
          TopicArn: {
            Ref: SNS_TOPIC_LOCAL_NAME,
          },
          FilterPolicy: {
            isExpensive: ['true'],
          },
        },
      },
      SNSSubscriptionCheapProducts: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: 'zzzeninzenin@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: SNS_TOPIC_LOCAL_NAME,
          },
          FilterPolicy: {
            isExpensive: ['false'],
          },
        },
      },
    },
    Outputs: {
      SQSQueueArn: {
        Value: {
          'Fn::GetAtt': [SQS_QUEUE_LOCAL_NAME, 'Arn'],
        },
        Export: {
          Name: `${SQS_QUEUE_NAME}Arn`,
        },
      },
      SNSTopicArn: {
        Value: {
          Ref: SNS_TOPIC_LOCAL_NAME,
        },
        Export: {
          Name: `${SNS_TOPIC_NAME}Arn`,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
