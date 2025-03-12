import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ShopifyApiClientModule } from '@app/shopify-api-client';
import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { ProductFacebookModule } from 'src/product-facebook/product-facebook.module';
import { ShopifyOauthGaurdModule } from '@app/helper/guard/guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';

@Module({
  imports: [
    ShopifyApiClientModule,
    BullModule.registerQueue(
      { name: QueueChanel.CREATE_PRODUCT_WEBHOOK },
      { name: QueueChanel.DELETE_PRODUCT_WEBHOOK },
    ),
    ShopifyOauthGaurdModule,
    TypeOrmModule.forFeature([ShopifyMemberToken]),
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
