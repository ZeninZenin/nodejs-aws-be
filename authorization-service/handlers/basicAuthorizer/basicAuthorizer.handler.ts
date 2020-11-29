import { APIGatewayTokenAuthorizerHandler, APIGatewayAuthorizerResult } from 'aws-lambda';
import { logger } from '../../services';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (event, context, cb) => {
  logger.info(`basicAuthorizer(); event: ${JSON.stringify(event)}`);
  process.on('uncaughtException', err => {
    logger.error(err);
  });

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
    return null;
  }

  const result: APIGatewayAuthorizerResult = {
    principalId: '',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Deny',
          Resource: event.methodArn,
        },
      ],
    },
  };

  try {
    const encodedCreds = event.authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const [username, password] = buff.toString('utf-8').split(':');
    result.principalId = encodedCreds;

    if (password && password === process.env[username]) {
      result.policyDocument.Statement[0].Effect = 'Allow';
    }
    console.log(JSON.stringify(result));
    return result;
  } catch (error) {
    cb(`Unauthorized: ${error?.message}`);
    logger.error(error?.message);
  }
};
