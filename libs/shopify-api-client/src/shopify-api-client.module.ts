import { Module } from '@nestjs/common';
import { ShopifyApiClientService } from './shopify-api-client.service';
import { ConfigModule } from '@nestjs/config';
import { ProductGraphQLService } from './product.service';

@Module({
  imports: [ConfigModule],
  providers: [ShopifyApiClientService, ProductGraphQLService],
  exports: [ShopifyApiClientService, ProductGraphQLService],
})
export class ShopifyApiClientModule {}
