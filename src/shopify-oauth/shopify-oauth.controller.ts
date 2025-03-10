import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
} from '@nestjs/common';
import { ShopifyOauthService } from './shopify-oauth.service';
import { CreateShopifyOauthDto } from './dto/create-shopify-oauth.dto';
import { UpdateShopifyOauthDto } from './dto/update-shopify-oauth.dto';
import { Request, Response } from 'express';

@Controller()
export class ShopifyOauthController {
  constructor(private readonly shopifyOauthService: ShopifyOauthService) {}

  @Get('auth/callback')
  async callbackOauth(@Req() req: Request, @Res() res: Response) {
    const session =
      await this.shopifyOauthService.ShopifyApiOauth.auth.callback({
        rawRequest: req,
        rawResponse: res,
      });
    // You can now use callback.session to make API requests

    return res.redirect(
      `https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`,
    );
  }
  @Post('auth/shopify/callback')
  shopifyCallbackOauth(@Req() req: Request, @Res() res: Response) {
    console.log('shopifyCallbackOauthReq', req);
    console.log('shopifyCallbackOauthRes', res);
  }
  @Post('api/auth/callback')
  apiCallbackOauth(@Req() req: Request, @Res() res: Response) {
    console.log('apiCallbackOauthReq', req);
    console.log('apiCallbackOauthRes', res);
  }
  @Get()
  findAll() {
    return this.shopifyOauthService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shopifyOauthService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateShopifyOauthDto: UpdateShopifyOauthDto,
  ) {
    return this.shopifyOauthService.update(+id, updateShopifyOauthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shopifyOauthService.remove(+id);
  }
}
