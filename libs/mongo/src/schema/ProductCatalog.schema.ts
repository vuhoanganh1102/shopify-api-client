import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductCatalogDocument = HydratedDocument<ProductCatalog>;

@Schema()
export class ProductCatalog {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  product_count: number;

  @Prop({ required: true })
  vertical: string;
}

export const ProductCatalogSchema =
  SchemaFactory.createForClass(ProductCatalog);
