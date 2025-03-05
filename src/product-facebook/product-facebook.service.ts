import { Injectable } from '@nestjs/common';
import { CreateProductFacebookDto } from './dto/create-product-facebook.dto';
import { UpdateProductFacebookDto } from './dto/update-product-facebook.dto';
import { Product } from '@app/mongo/schema/Products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacebookService } from 'src/facebook/facebook.service';
import { ProductCatalog } from '@app/mongo/schema/ProductCatalog.schema';

@Injectable()
export class ProductFacebookService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductCatalog.name)
    private productCatalogModel: Model<ProductCatalog>,

    private readonly facebookService: FacebookService,
  ) {}
  async createMultipleProducts(
    createProductFacebookDto: CreateProductFacebookDto[],
  ) {
    console.log(createProductFacebookDto);

    return 'This action adds a new productFacebook';
  }

  async getProductsForm() {
    return `This action returns all productFacebook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productFacebook`;
  }

  update(id: number, updateProductFacebookDto: UpdateProductFacebookDto) {
    return `This action updates a #${id} productFacebook`;
  }

  remove(id: number) {
    return `This action removes a #${id} productFacebook`;
  }
}
