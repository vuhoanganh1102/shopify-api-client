import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductGraphQLService } from '@app/shopify-api-client/product.service';
import { ProductQuery } from '@app/shopify-api-client/interface/productApi';
import { Request, Response } from 'express';

@Injectable()
export class ProductService {
  constructor(private readonly productGraphQL: ProductGraphQLService) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async getProduct(productQuery: ProductQuery) {
    const getDataApi = await this.productGraphQL.getProduct(productQuery);
    return getDataApi;
  }

  async productCreateWebhook(req: Request, res: Response) {
    console.log(req.body);
    console.log(res);
  }
}
