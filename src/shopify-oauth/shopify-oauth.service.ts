import { ExecutionContext, Injectable, Logger, Req, Res } from '@nestjs/common';
import { CreateShopifyOauthDto } from './dto/create-shopify-oauth.dto';
import { UpdateShopifyOauthDto } from './dto/update-shopify-oauth.dto';
import {
  shopifyApi,
  LATEST_API_VERSION,
  RequestedTokenType,
} from '@shopify/shopify-api';
import { MySQLSessionStorage } from '@shopify/shopify-app-session-storage-mysql';
// import { MongoDBSessionStorage } from '@shopify/shopify-app-session-storage-mongodb';
import '@shopify/shopify-api/adapters/node'; // ✅ Import the Node.js adapter
import { Response, Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';
import { Repository } from 'typeorm';
import { shopifyApp } from '@shopify/shopify-app-express';

@Injectable()
export class ShopifyOauthService {
  private readonly logger = new Logger(ShopifyOauthService.name);
  private shopifyApiOauth;
  private shopifyApp;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ShopifyMemberToken)
    private readonly shopifyMemberTokenRepo: Repository<ShopifyMemberToken>,
  ) {
    this.shopifyApp = shopifyApp({
      api: {
        apiVersion: LATEST_API_VERSION,
        hostName: process.env.SHOPIFY_APP_URL?.replace(/^https?:\/\//, ''), // 👈 Thêm dòng này
        future: {
          customerAddressDefaultFix: true,
          lineItemBilling: true,
          unstable_managedPricingSupport: true,
        },
        billing: undefined, // or replace with billingConfig above to enable example billing
      },
      auth: {
        path: '/api/auth',
        callbackPath: '/api/auth/callback',
        useOnlineTokens: false, // 👈 Thêm dòng này để tránh vấn đề về cookie
      },
      webhooks: {
        path: '/api/webhooks',
      },
      // This should be replaced with your preferred storage strategy
      sessionStorage: new MySQLSessionStorage(
        new URL(
          `mysql://${process.env.MYSQL_USER}:${process.env.MYSQL_PASS}@${process.env.MYSQL_HOST}/${process.env.MYSQL_DBNAME}`,
        ),
        { connectionPoolLimit: 10 }, // optional
      ),
    });
    if (this.shopifyApp) {
      this.logger.log('Successfull Init shopifyApp!!!');
    }
    this.shopifyApiOauth = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
      apiVersion: LATEST_API_VERSION,
      appUrl: process.env.SHOPIFY_APP_URL || '',
      scopes: process.env.SCOPES?.split(','),
      // hostScheme: process.env.HOST?.split('://')[0] as 'http' | 'https',
      hostName: process.env.SHOPIFY_HOST?.replace(/https?:\/\//, ''),
      isEmbeddedApp: true,
      // sessionStorage: new MongoDBSessionStorage(
      //   new URL(process.env.MONGODB_URI),
      //   'shopify_sessions',
      // ), // ✅ Ensures sessions are stored
    });
    if (this.shopifyApiOauth) {
      this.logger.log('Successfull Init shopifyApiOauth!!!');
    }
  }
  get ShopifyApiOauth() {
    return this.shopifyApiOauth;
  }
  get ShopifyApp() {
    return this.shopifyApp;
  }
  /**
   * 1️⃣ Tạo URL để redirect merchant đến Shopify OAuth
   */
  generateAuthUrl(shop: string): string {
    const clientId = this.configService.get<string>('SHOPIFY_API_KEY');
    const scopes = this.configService.get<string>('SHOPIFY_SCOPES');
    const redirectUri = this.configService.get<string>('SHOPIFY_REDIRECT_URI');
    const state = crypto.randomBytes(16).toString('hex'); // CSRF Protection

    return `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}&state=${state}`;
  }

  /**
   * 2️⃣ Đổi Authorization Code lấy Access Token
   */
  async getAccessToken(shop: string, code: string, user: any): Promise<string> {
    const clientId = this.configService.get<string>('SHOPIFY_API_KEY');
    const clientSecret = this.configService.get<string>('SHOPIFY_API_SECRET');
    console.log('user', user);
    if (user) {
      return 'Shopify OAuth thành công! Bạn có thể đóng tab này.';
    }
    try {
      const response = await axios.post(
        `https://${shop}/admin/oauth/access_token`,
        {
          client_id: clientId,
          client_secret: clientSecret,
          code,
        },
      );
      const exData = await this.shopifyMemberTokenRepo.findOne({
        where: { shop },
      });

      if (exData)
        await this.shopifyMemberTokenRepo.update(
          { id: exData.id },
          {
            accessToken: response.data.access_token,
            scope: response.data.scope,
          },
        );
      else
        this.shopifyMemberTokenRepo.insert({
          shop,
          accessToken: response.data.access_token,
          scope: response.data.scope,
        });
      return '✅ Shopify OAuth thành công! Bạn có thể đóng tab này.';
    } catch (error) {
      this.logger.error('❌ Lỗi khi lấy Access Token từ Shopify', error);
      throw new Error('Failed to retrieve access token');
    }
  }

  /**
   * 3️⃣ Kiểm tra tính hợp lệ của request bằng HMAC
   */
  verifyHmac(query: any): boolean {
    const secret = this.configService.get<string>('SHOPIFY_API_SECRET');
    const { hmac, ...params } = query;

    const message = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const calculatedHmac = crypto
      .createHmac('sha256', secret)
      .update(message)
      .digest('hex');

    return calculatedHmac === hmac;
  }
  getSessionTokenHeader(request) {
    return request.headers['authorization']?.replace('Bearer ', '');
  }

  getSessionTokenFromUrlParam(request) {
    const searchParams = new URLSearchParams(request.url);

    return searchParams.get('id_token');
  }

  redirectToSessionTokenBouncePage(req, res) {
    const searchParams = new URLSearchParams(req.query);
    // Remove `id_token` from the query string to prevent an invalid session token sent to the redirect path.
    searchParams.delete('id_token');

    // Using shopify-reload path to redirect the bounce automatically.
    searchParams.append(
      'shopify-reload',
      `${req.path}?${searchParams.toString()}`,
    );
    res.redirect(`/session-token-bounce?${searchParams.toString()}`);
  }

  async Authorize(@Req() req: Request, @Res() res: Response) {
    let encodedSessionToken = null;
    let decodedSessionToken = null;
    try {
      encodedSessionToken =
        this.getSessionTokenHeader(req) ||
        this.getSessionTokenFromUrlParam(req);

      // "shopify" is an instance of the Shopify API library object,
      // You can install and configure the Shopify API library through: https://www.npmjs.com/package/@shopify/shopify-api
      decodedSessionToken =
        await this.ShopifyApiOauth.session.decodeSessionToken(
          encodedSessionToken,
        );
    } catch (e) {
      // Handle invalid session token error
      const isDocumentRequest = !req.headers['authorization'];
      if (isDocumentRequest) {
        return this.redirectToSessionTokenBouncePage(req, res);
      }

      throw new Response(undefined, {
        status: 401,
        statusText: 'Unauthorized',
        headers: new Headers({
          'X-Shopify-Retry-Invalid-Session-Request': '1',
        }),
      });
    }

    const dest = new URL(decodedSessionToken.dest);
    const shop = dest.hostname;
    const accessToken = await this.ShopifyApiOauth.auth.tokenExchange({
      shop,
      sessionToken: encodedSessionToken,
      requestedTokenType: RequestedTokenType.OnlineAccessToken, // or RequestedTokenType.OfflineAccessToken
    });

    res.setHeader('Content-Type', 'text/html');
    const html = `
  <body>
    <h1>Retrieved access Token</h1>
    <p>${JSON.stringify(accessToken, null, 2)}</p>
  </body>`;
    res.send(html);
  }
  create(createShopifyOauthDto: CreateShopifyOauthDto) {
    return 'This action adds a new shopifyOauth';
  }

  findAll() {
    return `This action returns all shopifyOauth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shopifyOauth`;
  }

  update(id: number, updateShopifyOauthDto: UpdateShopifyOauthDto) {
    return `This action updates a #${id} shopifyOauth`;
  }

  remove(id: number) {
    return `This action removes a #${id} shopifyOauth`;
  }
}
