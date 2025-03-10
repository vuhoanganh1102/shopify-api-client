import { Module } from '@nestjs/common';
import { ShopifyOauthService } from './shopify-oauth.service';
import { ShopifyOauthController } from './shopify-oauth.controller';

@Module({
  controllers: [ShopifyOauthController],
  providers: [ShopifyOauthService],
  exports: [ShopifyOauthService],
})
export class ShopifyOauthModule {}
