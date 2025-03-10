import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ShopifyApiClientModule } from '@app/shopify-api-client';
import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';

@Module({
  imports: [
    ShopifyApiClientModule,
    BullModule.registerQueue({ name: QueueChanel.CREATE_PRODUCT_WEBHOOK }),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
