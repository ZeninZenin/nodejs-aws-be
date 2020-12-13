import { Controller, Request, HttpStatus, All } from '@nestjs/common';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { RECIPIENT_URL_ENV_VAR_NAMES } from './constants';

@Controller()
export class AppController {
  @All()
  async handle(@Request() req: Request) {
    const { method, body, url } = req;
    console.log({ method, body, url });

    const recipient = url.split('/')[1];
    const recipientUrl = process.env[RECIPIENT_URL_ENV_VAR_NAMES[recipient]];
    console.log({ recipient, recipientUrl });

    if (!recipientUrl) {
      return {
        statusCode: HttpStatus.BAD_GATEWAY,
      };
    }

    const axiosConfig: AxiosRequestConfig = {
      method: method as Method,
      url: `${recipientUrl}${url}`,
      ...(Object.keys(body || {}).length > 0 && { data: body }),
    }

    console.log({ axiosConfig })

    try {
      const { data } = await axios(axiosConfig);

      return data;
    } catch(error) {
      console.log(error);

      if (error.response) {
        return error.response.data;
      }

      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
