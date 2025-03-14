import { Module } from '@nestjs/common';
import { ProductFacebookService } from './product-facebook.service';
import { ProductFacebookController } from './product-facebook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from '@app/mongo/schema/Products.schema';
import { FacebookModule } from 'src/facebook/facebook.module';
import {
  ProductCatalog,
  ProductCatalogSchema,
} from '@app/mongo/schema/ProductCatalog.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Products } from '@app/mysql/entities/products.entity';
import { ShopifyOauthGaurdModule } from '@app/helper/guard/guard.module';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';
import { ProductMedia } from '@app/mysql/entities/productMedia.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductCatalog.name, schema: ProductCatalogSchema },
    ]),
    FacebookModule,
    TypeOrmModule.forFeature([
      FacebookMemberToken,
      Products,
      ShopifyMemberToken,
      ProductMedia,
    ]),
    ShopifyOauthGaurdModule,
  ],
  controllers: [ProductFacebookController],
  providers: [ProductFacebookService],
  exports: [ProductFacebookService],
})
export class ProductFacebookModule {}
