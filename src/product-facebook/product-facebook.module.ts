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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Product.name, schema: ProductSchema },
      { name: ProductCatalog.name, schema: ProductCatalogSchema },
    ]),
    FacebookModule,
  ],
  controllers: [ProductFacebookController],
  providers: [ProductFacebookService],
})
export class ProductFacebookModule {}
