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
  Query,
  Redirect,
  ExecutionContext,
  UseGuards,
} from '@nestjs/common';
import { ShopifyOauthService } from './shopify-oauth.service';
import { CreateShopifyOauthDto } from './dto/create-shopify-oauth.dto';
import { UpdateShopifyOauthDto } from './dto/update-shopify-oauth.dto';
import { Response } from 'express';
import { ShopifyAuthGuard } from '@app/helper/guard/shopifyMember.guard';
import { UserData } from '@app/helper/decorators/user.decorator';
@UseGuards(ShopifyAuthGuard)
@Controller()
export class ShopifyOauthController {
  constructor(private readonly shopifyOauthService: ShopifyOauthService) {}
  // @Get('auth')
  // async auth(@Req() req: Request, @Res() res: Response) {
  //   const shopify = this.shopifyOauthService.ShopifyApp;
  //   return shopify.auth.begin()(req, res);
  // }

  // @Get('/api/auth/callback')
  // async authCallback(@Req() req: Request, @Res() res: Response) {
  //   const shopify = this.shopifyOauthService.ShopifyApp;
  //   return shopify.auth.callback()(req, res, () =>
  //     shopify.redirectToShopifyOrAppRoot()(req, res),
  //   );
  // }
  /**
   * 1️⃣ Bước đầu tiên: Redirect merchant đến Shopify để xác thực OAuth
   */
  @Get('/auth')
  @Redirect()
  install(@Query('shop') shop: string) {
    const authUrl = this.shopifyOauthService.generateAuthUrl(shop);
    return { url: authUrl };
  }

  /**
   * 2️⃣ Xử lý Callback từ Shopify sau khi merchant cấp quyền
   */
  @Get('/auth/callback')
  async callback(
    @Query() query: any,
    @Res() res: Response,
    @UserData() user: any,
  ) {
    const { shop, code, hmac } = query;

    // 🛑 Kiểm tra tính hợp lệ của request bằng HMAC
    if (!this.shopifyOauthService.verifyHmac(query)) {
      return res.status(400).send('Invalid HMAC');
    }

    try {
      // 🔥 Lấy Access Token
      const result = await this.shopifyOauthService.getAccessToken(
        shop,
        code,
        user,
      );
      // ✅ Điều hướng đến trang admin của app
      if (result)
        return res.redirect(
          'https://admin.shopify.com/store/initalstore/apps/demo-shopi-2',
        );
      return res.send('fail to login!!');
    } catch (error) {
      return res.status(500).send('Lỗi khi xác thực Shopify App');
    }
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
