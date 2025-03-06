import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios from 'axios';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import * as querystring from 'querystring';
import { UserToken } from '@app/mongo/schema/UserToken.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Repository } from 'typeorm';

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
    @InjectRepository(FacebookMemberToken)
    private readonly facebookMemberTokenRepo: Repository<FacebookMemberToken>,
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

      //Lay token vo han
      // const appsecretProof = crypto
      //   .createHmac('sha256', this.facebookApi.clientSecret)
      //   .update(accessToken)
      //   .digest('hex');
      // const unlimitedTokenRes = await axios.post(
      //   `${this.facebookApi.graphApiDomain}/${this.facebookApi.clientBusinessId}/system_user_access_tokens?appsecret_proof=${appsecretProof}&access_token=${accessToken}&fetch_only=true`,
      // );
      // console.log('ccc1', unlimitedTokenRes);
      // savedData['token'] = unlimitedTokenRes?.data?.access_token || null;

      // lay token long-lived
      const longLivedToken = await axios.get(
        `${this.facebookApi.graphApiDomain}/oauth/access_token?grant_type=fb_exchange_token&client_id=${this.facebookApi.clientId}&client_secret=${this.facebookApi.clientSecret}&fb_exchange_token=${accessToken}`,
      );
      savedData['token'] = longLivedToken?.data?.access_token || null;
      savedData['token_type'] = longLivedToken?.data?.token_type || null;
      savedData['expires_in'] = longLivedToken?.data?.expires_in || null;
      await this.facebookMemberTokenRepo.insert(savedData);
      res.json({ message: 'Login successful', user: userResponse.data });
    } catch (error) {
      // Kiểm tra nếu lỗi có phải là do response từ API
      console.error('Data:', error.response.data); // Nội dung phản hồi lỗi từ API
      // if (error.response) {
      //   console.error('API Error:');
      //   console.error('Status:', error.response.status); // Mã trạng thái HTTP

      // } else if (error.request) {
      //   // Lỗi khi không nhận được phản hồi từ máy chủ
      //   console.error('No response received:');
      //   console.error(error.request);
      // } else {
      //   // Các lỗi khác
      //   console.error('Error in setup:', error.message);
      // }
      // console.error('Full Error:', error); // Log chi tiết về lỗi
      res.status(500).send('Authentication failed.');
    }
  }
}
