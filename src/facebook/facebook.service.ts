import '@shopify/shopify-api/adapters/node';

import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Request, Response } from 'express';

export class FacebookService {
  constructor(
    private configService: ConfigService,
    // @InjectModel(SessionShopify.name)
    // private SessionShopifyModel: Model<SessionShopify>,
    // private readonly sessionService: SessionService,
  ) {}
  private readonly facebookApiInstance = {
    authorizationEndpoint: this.configService.get<string>('AUTH_END_POINT'),
    baseUrl: this.configService.get<string>('BASE_URL'),
    baseStoreUrl: this.configService.get<string>('BASE_STORE_URL'),
    developerToken: this.configService.get<string>('DEV_TOKEN'),
    clientId: this.configService.get<string>('CLIENT_ID_FB'),
    clientSecret: this.configService.get<string>('CLIENT_SECRET'),
    redirectUri:
      this.configService.get<string>('REDIRECT_URI') ||
      'http://localhost:3004/api-v2/facebooks/connect',
  };
  get facebookApi() {
    return this.facebookApiInstance;
  }

  async getAccessToken(req: Request, res: Response) {
    const { code } = req.query;

    if (!code) {
      return res.send('Error: No code returned from Facebook');
    }

    try {
      const response = await axios.get(
        `https://graph.facebook.com/v18.0/oauth/access_token`,
        {
          params: {
            client_id: this.facebookApiInstance.clientId,
            client_secret: this.facebookApiInstance.clientSecret,
            redirect_uri: this.facebookApiInstance.redirectUri,
            code: code,
          },
        },
      );

      const accessToken = response.data.access_token;
      res.send(`Your Access Token: ${accessToken}`);
    } catch (error) {
      console.error(
        'Error fetching access token:',
        error.response?.data || error.message,
      );
      res.send('Failed to get access token');
    }
  }
}
