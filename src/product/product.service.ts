import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductGraphQLService } from '@app/shopify-api-client/product.service';
import {
  ProductQuery,
  ProductQueryDB,
  returnPaging,
} from '@app/shopify-api-client/interface/productApi';
import { Request, Response } from 'express';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { InjectQueue } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { Queue } from 'bullmq';
import { ProductFacebookService } from 'src/product-facebook/product-facebook.service';
import { Products } from '@app/mysql/entities/products.entity';
import { ProductMedia } from '@app/mysql/entities/productMedia.entity';

@Injectable()
export class ProductService {
  constructor(
    private readonly productGraphQL: ProductGraphQLService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    @InjectQueue(QueueChanel.CREATE_PRODUCT_WEBHOOK)
    private readonly createProductWebhookQueue: Queue,
    @InjectQueue(QueueChanel.DELETE_PRODUCT_WEBHOOK)
    private readonly deleteProductWebhookQueue: Queue,
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
    @InjectRepository(ProductMedia)
    private readonly productMediaRepo: Repository<ProductMedia>,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll() {
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

  async getProduct(query: ProductQueryDB) {
    // const getDataApi = await this.productGraphQL.getProduct(productQuery);
    // return getDataApi;
    const productsQb = this.productsRepo
      .createQueryBuilder('p')
      .leftJoin(ProductMedia, 'pm', 'pm.productId = p.id')
      .select([
        'p.id id',
        'p.title title',
        'p.description description',
        'p.vendor vendor',
        'p.pricing pricing',
        'p.quantity quantity',
        'p.productStatus productStatus',
        'p.userId userId',
        `CONCAT('[', GROUP_CONCAT(JSON_OBJECT('id', pm.id, 'url',pm.url, 'type', pm.type)),']') images`,
      ])
      .groupBy('p.id');

    if (query?.orderby)
      productsQb.orderBy(`p.${query.sortBy}`, query.orderby || 'ASC');
    const products = await productsQb
      .limit(query.limit)
      .offset(query.offset)
      .getRawMany();
    products.forEach((e) => {
      e.images = JSON.parse(e.images);
      if (e.images[0].id === null) e.images = null;
    });
    return returnPaging(products, products.length, query);
  }

  async productCreateWebhook(req: Request, res: Response) {
    const dataFormWebhook = req.body;
    this.createProductWebhookQueue.add(
      `${QueueChanel.CREATE_PRODUCT_WEBHOOK}:${dataFormWebhook?.id}`,
      dataFormWebhook,
      {
        attempts: 5, // thu lai 5 lan neu that bai
        removeOnComplete: true,
        removeOnFail: true,
        backoff: { type: 'exponential', delay: 5000 }, // Tăng thời gian chờ khi retry
      },
    );
    // Trả về OK ngay lập tức để Shopify không gửi lại webhook
    return res.status(HttpStatus.OK).json({ message: 'Webhook received' });
  }

  async productDelWebhook(req: Request, res: Response) {
    const dataFormWebhook = req.body;

    this.deleteProductWebhookQueue.add(
      `${QueueChanel.DELETE_PRODUCT_WEBHOOK}:${dataFormWebhook?.id}`,
      dataFormWebhook,
      {
        attempts: 5, // thu lai 5 lan neu that bai
        removeOnComplete: true,
        removeOnFail: true,
        backoff: { type: 'exponential', delay: 5000 }, // Tăng thời gian chờ khi retry
      },
    );
    // Trả về OK ngay lập tức để Shopify không gửi lại webhook
    return res.status(HttpStatus.OK).json({ message: 'Webhook received' });
  }
}
