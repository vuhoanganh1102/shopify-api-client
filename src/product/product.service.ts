import { ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductGraphQLService } from '@app/shopify-api-client/product.service';
import { ProductQuery } from '@app/shopify-api-client/interface/productApi';
import { Request, Response } from 'express';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { InjectQueue } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { Queue } from 'bullmq';
import { ProductFacebookService } from 'src/product-facebook/product-facebook.service';

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
  ) {}
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
