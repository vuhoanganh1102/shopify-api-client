import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ShopifyApiClientModule } from '@app/shopify-api-client';

@Module({
  imports: [ShopifyApiClientModule],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
