import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ShopifyApiClientModule } from '@app/shopify-api-client';
import { ShopifyOauthModule } from 'src/shopify-oauth/shopify-oauth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';

@Module({
  imports: [
    ShopifyApiClientModule,
    ShopifyOauthModule,
    TypeOrmModule.forFeature([ShopifyMemberToken]),
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
