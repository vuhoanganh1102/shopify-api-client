import { Module } from '@nestjs/common';
import { ShopifyOauthService } from './shopify-oauth.service';
import { ShopifyOauthController } from './shopify-oauth.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';
import { ShopifyOauthGaurdModule } from '@app/helper/guard/guard.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopifyMemberToken]),
    ConfigModule.forRoot(),
    ShopifyOauthGaurdModule,
  ],
  controllers: [ShopifyOauthController],
  providers: [ShopifyOauthService],
  exports: [ShopifyOauthService],
})
export class ShopifyOauthModule {}
