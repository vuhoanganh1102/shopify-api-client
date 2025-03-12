import { Injectable, Logger } from '@nestjs/common';
import { CreateProductFacebookDto } from './dto/create-product-facebook.dto';
import { UpdateProductFacebookDto } from './dto/update-product-facebook.dto';
import { Product } from '@app/mongo/schema/Products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FacebookService } from 'src/facebook/facebook.service';
import { ProductCatalog } from '@app/mongo/schema/ProductCatalog.schema';
import { InjectRepository } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Products } from '@app/mysql/entities/products.entity';
import { SyncFacebookType } from '@app/helper/enum';

@Injectable()
export class ProductFacebookService {
  private readonly logger = new Logger(ProductFacebookService.name);
  // private readonly FACEBOOK_CATALOG_ID = process.env.FACEBOOK_CATALOG_ID;
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    @InjectModel(ProductCatalog.name)
    private productCatalogModel: Model<ProductCatalog>,
    private readonly facebookService: FacebookService,
    @InjectRepository(FacebookMemberToken)
    private readonly facebookMemberTokenRepo: Repository<FacebookMemberToken>,
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
  ) {}

  async uploadProducts(user: any) {
    const userFB = await this.getUserFacebook(user.id);
    const products = await this.productsRepo.find({
      where: { userId: user.userId, syncFacebook: SyncFacebookType.SYNC },
    });
    if (
      !this.facebookService.facebookApi.facebookCatalogProduct ||
      !userFB.token
    ) {
      this.logger.error('Thiếu thông tin cấu hình Facebook.');
      return;
    }
    await this.productsRepo
      .createQueryBuilder()
      .update(Products)
      .set({ syncFacebook: SyncFacebookType.SYNCED })
      .where('id IN (:...ids)', { ids: products.map((p) => p.id) })
      .execute();
    const url = `${this.facebookService.facebookApi.graphApiDomain}/${this.facebookService.facebookApi.facebookCatalogProduct}/batch`;

    // Định dạng sản phẩm theo yêu cầu của Facebook
    const formattedProducts = products.map((product) => ({
      method: 'CREATE',
      id: `online:${product.id}`,
      retailer_id: `retailer_${product.id}`,
      data: {
        name: product.title,
        description: product.description || 'Không có mô tả',
        availability: product.quantity > 0 ? 'in stock' : 'out of stock',
        price: product.pricing || 1,
        currency: 'VND',
        image_url:
          'https://cdn.shopify.com/s/files/1/0916/8086/6591/files/gao.jpg?v=1739852745',
        url: `https://yourwebsite.com/product/${product.id}`,
        brand: product.category || 'No Brand',
      },
    }));
    console.log(formattedProducts);
    try {
      const response = await axios.post(
        url,
        {
          access_token: userFB.token,

          requests: formattedProducts,
        },
        {
          headers: {
            Authorization: `Bearer ${userFB.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log(
        `Đẩy sản phẩm thành công: ${JSON.stringify(response.data)}`,
      );
      return { successfull: true };
    } catch (error) {
      console.log(
        `Lỗi khi đẩy sản phẩm: ${error.response?.data || error.message}`,
        error.response?.data,
      );
    }
  }

  async getAllProductShopify(user: any) {
    return await this.productsRepo.find({ where: { userId: user.userId } });
  }
  async getUserFacebook(id: number) {
    return await this.facebookMemberTokenRepo.findOne({
      where: { shopifyUserId: id },
    });
  }

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
