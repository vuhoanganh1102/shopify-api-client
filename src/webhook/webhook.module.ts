import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { ShopifyApiClientModule } from '@app/shopify-api-client';

@Module({
  imports: [ShopifyApiClientModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
