import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { ProductCatalog } from './ProductCatalog.schema'; // Import ProductCatalog

export type ProductDocument = HydratedDocument<Product>;

@Schema()
export class Product {
  @Prop({ required: true })
  id: string;

  @Prop()
  retailer_id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: string;

  @Prop({ default: 'USD' })
  currency: string;

  @Prop()
  image_url: string;

  @Prop()
  availability: string;

  @Prop()
  condition: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ProductCatalog',
    required: true,
  })
  productCatalogId: ProductCatalog; // Liên kết với ProductCatalog
}

export const ProductSchema = SchemaFactory.createForClass(Product);
