import type { Serverless } from 'serverless/aws';
import { LAMBDA_AUTH_NAME } from './constants';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'authorization-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
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
  },
  functions: {
    [LAMBDA_AUTH_NAME]: {
      handler: `handler.${LAMBDA_AUTH_NAME}`,
    },
  },
  resources: {
    Resources: {},
    Outputs: {
      lambdaAuthorizerArn: {
        Value: {
          'Fn::GetAtt': [`${LAMBDA_AUTH_NAME[0].toUpperCase()}${LAMBDA_AUTH_NAME.slice(1)}LambdaFunction`, 'Arn'],
        },
        Export: {
          Name: `${LAMBDA_AUTH_NAME}Arn`,
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
