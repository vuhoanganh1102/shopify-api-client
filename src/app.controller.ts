import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { ShopifyOauthService } from './shopify-oauth/shopify-oauth.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly shopifyApi: ShopifyOauthService,
  ) {}
  @Get()
  async handleShopifyRedirect(@Query() query: any, @Res() res: Response) {
    console.log('Shopify redirect query:', query);

    if (!query.shop) {
      return res.status(400).json({ error: "Missing 'shop' parameter" });
    }

    // Redirect the user to the OAuth installation flow
    const redirectUrl = `https://${query.shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=${process.env.SHOPIFY_SCOPES}&redirect_uri=${process.env.SHOPIFY_APP_URL}/auth/callback`;

    return res.redirect(redirectUrl);
  }
  @Get('/session-token-bounce')
  async sessionTokenBounce(@Query() query: any, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/html');
    // "process.env.SHOPIFY_API_KEY" is available if you use Shopify CLI to run your app.
    // You can also replace it with your App's Client ID manually.
    const html = `
  <head>
      <meta name="shopify-api-key" content="${process.env.SHOPIFY_API_KEY}" />
      <script src="https://cdn.shopify.com/shopifycloud/app-bridge.js"></script>
  </head>
  `;
    res.send(html);
  }
  @Get('/authorize')
  async authorize(@Req() req: Request, @Res() res: Response) {
    return this.shopifyApi.Authorize(req, res);
  }
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
