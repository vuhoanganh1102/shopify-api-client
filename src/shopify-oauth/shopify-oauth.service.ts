import { Injectable, Logger, Req, Res } from '@nestjs/common';
import { CreateShopifyOauthDto } from './dto/create-shopify-oauth.dto';
import { UpdateShopifyOauthDto } from './dto/update-shopify-oauth.dto';
import {
  shopifyApi,
  LATEST_API_VERSION,
  RequestedTokenType,
} from '@shopify/shopify-api';
import { MongoDBSessionStorage } from '@shopify/shopify-app-session-storage-mongodb';
import '@shopify/shopify-api/adapters/node'; // ✅ Import the Node.js adapter
import { Response, Request } from 'express';
@Injectable()
export class ShopifyOauthService {
  private readonly logger = new Logger(ShopifyOauthService.name);
  private shopifyApiOauth;
  constructor() {
    this.shopifyApiOauth = shopifyApi({
      apiKey: process.env.SHOPIFY_API_KEY,
      apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
      apiVersion: LATEST_API_VERSION,
      appUrl: process.env.SHOPIFY_APP_URL || '',
      scopes: process.env.SCOPES?.split(','),
      // hostScheme: process.env.HOST?.split('://')[0] as 'http' | 'https',
      hostName: process.env.SHOPIFY_HOST?.replace(/https?:\/\//, ''),
      isEmbeddedApp: true,
      sessionStorage: new MongoDBSessionStorage(
        new URL(process.env.MONGODB_URI),
        'shopify_sessions',
      ), // ✅ Ensures sessions are stored
    });
    if (this.shopifyApiOauth) {
      this.logger.log('Successfull Init shopifyApiOauth!!!');
    }
  }
  get ShopifyApiOauth() {
    return this.shopifyApiOauth;
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
