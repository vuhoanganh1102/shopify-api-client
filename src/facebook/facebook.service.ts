import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { UserToken } from '@app/mongo/schema/UserToken.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

interface facebookApiInstance {
  authorizationEndpoint: string;
  baseUrl: string;
  baseStoreUrl: string;
  developerToken: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  graphApiDomain: string;
  scope: string;
  clientBusinessId: string;
  fbDomain: string;
}
@Injectable()
export class FacebookService {
  private facebookApiInstance: facebookApiInstance;
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(UserToken.name)
    private UserTokenModel: Model<UserToken>,
  ) {
    this.facebookApiInstance = {
      authorizationEndpoint: this.configService.get<string>('AUTH_END_POINT'),
      baseUrl: this.configService.get<string>('BASE_URL'),
      baseStoreUrl: this.configService.get<string>('BASE_STORE_URL'),
      developerToken: this.configService.get<string>('DEV_TOKEN'),
      clientId: this.configService.get<string>('CLIENT_ID_FB'),
      clientSecret: this.configService.get<string>('CLIENT_SECRET'),
      redirectUri: this.configService.get<string>('REDIRECT_URI'),
      graphApiDomain: this.configService.get<string>('FB_API_DOMAIN'),
      scope: this.configService.get<string>('FB_SCOPE'),
      clientBusinessId: this.configService.get<string>('CLIENT_BUSINESS_ID'),
      fbDomain: this.configService.get<string>('FB_DOMAIN'),
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
  async checkAuth(req: Request, res: Response) {
    const { codeVerifier, codeChallenge } = this.generatePKCE();
    const state = crypto.randomBytes(16).toString('hex'); // Bảo mật CSRF
    this.pkceStore['state'] = codeVerifier; // Lưu codeVerifier tạm thời

    const params = querystring.stringify({
      client_id: this.facebookApi.clientId,
      redirect_uri: this.facebookApi.redirectUri,
      response_type: 'code',
      scope: this.facebookApi.scope,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
      state,
    });

    const authURL = `${this.facebookApi.fbDomain}/dialog/oauth?${params}`;
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
        `${this.facebookApi.graphApiDomain}/oauth/access_token`,
        querystring.stringify({
          client_id: this.facebookApi.clientId,
          client_secret: this.facebookApi.clientSecret,
          redirect_uri: this.facebookApi.redirectUri,
          code: code as string,
          code_verifier: this.pkceStore['state'],
        }),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const accessToken = tokenResponse.data.access_token;
      // const accessToken =
      //   'EAAIZCGAqdmPcBOZCyMUlOgVhWl0XJneM2R4NUa3ZB6e7iNBu2KKet9cXY800Dcf9ORT6ZCDyaMQhlQIEzG2IZCkS1blBVt9zbWaboFjZCzaEcvIZB7fn7giz9w8ERODJGWTYXkJ8XhlukD7FoEe9XhzfVrZChdEzZAcpBsIlyWlcZA0dFHcLAvhmYZC5CZBSWZCZChQH3dhy7VaatjFKUwEC3pGhdNAcbzGUOzH0GOeP4EcaA0DFIXaBupsmU4DpNENd54drrKu9cZD';
      delete this.pkceStore['state']; // Xóa codeVerifier sau khi dùng

      const savedData = {};
      // Bước 4: Lấy thông tin user từ Facebook Graph API
      const userResponse = await axios.get(
        `${this.facebookApi.graphApiDomain}/me`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          params: { fields: 'id,name,email' },
        },
      );
      savedData['id'] = userResponse.data?.id || null;
      savedData['name'] = userResponse.data?.name || null;
      savedData['email'] = userResponse.data?.email || null;
      console.log('ccc', accessToken);
      //Lay token vo han
      const appsecretProof = crypto
        .createHmac('sha256', this.facebookApi.clientSecret)
        .update(accessToken)
        .digest('hex');
      console.log(appsecretProof);
      const unlimitedTokenRes = await axios.post(
        `${this.facebookApi.graphApiDomain}/${this.facebookApi.clientBusinessId}/system_user_access_tokens
      ?appsecret_proof=${appsecretProof}&access_token=${accessToken}
      &fetch_only=true`,
      );

      console.log('ccc1', unlimitedTokenRes);
      savedData['token'] = unlimitedTokenRes?.data?.access_token || null;

      await this.UserTokenModel.insertOne(savedData);
      res.json({ message: 'Login successful', user: userResponse.data });
    } catch (error) {
      console.error(error);
      res.status(500).send('Authentication failed.');
    }
  }
}
