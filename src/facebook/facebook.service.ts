import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
@Injectable()
export class FacebookService {
  private facebookApiInstance;
  constructor(
    private readonly configService: ConfigService,

    // @InjectModel(SessionShopify.name)
    // private SessionShopifyModel: Model<SessionShopify>,
    // private readonly sessionService: SessionService,
  ) {
    this.facebookApiInstance = {
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
  }

  get facebookApi() {
    return this.facebookApiInstance;
  }
  generatePKCE() {
    const codeVerifier = crypto.randomBytes(32).toString('hex');
    const hash = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64');
    const codeChallenge = hash
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    return { codeVerifier, codeChallenge };
  }
  pkceStore = {};
  async checkAuth(req: Request, res: Respone) {
    const { codeVerifier, codeChallenge } = this.generatePKCE();
    const state = crypto.randomBytes(16).toString('hex'); // Bảo mật CSRF
    this.pkceStore['state'] = codeVerifier; // Lưu codeVerifier tạm thời

    const params = querystring.stringify({
      client_id: this.configService.get<string>('CLIENT_ID_FB'),
      redirect_uri: this.configService.get<string>('REDIRECT_URI'),
      response_type: 'code',
      scope: 'public_profile,email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

    const authURL = `https://www.facebook.com/v22.0/dialog/oauth?${params}`;
    res.redirect(authURL);
  }

  async getAccessToken(req: Request, res: Response) {
    const { code, state } = req.query;
    if (!code || !state || !this.pkceStore['state']) {
      return res.status(400).send('Invalid request.');
    }

    try {
      // Bước 3: Gửi mã code + PKCE để lấy access token
      const tokenResponse = await axios.post(
        'https://graph.facebook.com/v12.0/oauth/access_token',
        querystring.stringify({
          client_id: this.configService.get<string>('CLIENT_ID_FB'),
          client_secret: this.configService.get<string>('CLIENT_SECRET'),
          redirect_uri: this.configService.get<string>('REDIRECT_URI'),
          code: code as string,
          code_verifier: this.pkceStore['state'],
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const accessToken = tokenResponse.data.access_token;

      delete this.pkceStore['state']; // Xóa codeVerifier sau khi dùng

      // Bước 4: Lấy thông tin user từ Facebook Graph API
      const userResponse = await axios.get('https://graph.facebook.com/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { fields: 'id,name,email' },
      });

      res.json({ message: 'Login successful', user: userResponse.data });
    } catch (error) {
      console.error(error);
      res.status(500).send('Authentication failed.');
    }
  }
}
