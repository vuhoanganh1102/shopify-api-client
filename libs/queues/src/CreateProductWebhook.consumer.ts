import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';

import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { Products } from '@app/mysql/entities/products.entity';
import { Variants } from '@app/mysql/entities/variants.entity';
import { ProductMedia } from '@app/mysql/entities/productMedia.entity';
import { MediaType } from '@app/helper/enum';
import { ProductFacebookService } from 'src/product-facebook/product-facebook.service';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';

@Injectable()
@Processor(QueueChanel.CREATE_PRODUCT_WEBHOOK) // limited 10 jobs is run in time
export class CreateProductWebhookConsumer extends WorkerHost {
  constructor(
    private readonly entityManager: EntityManager,
    private readonly productFacebookService: ProductFacebookService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(job);
    const jobData = job.data;
    console.log(`Processing job ${job?.id}`);
    await this.processProductCreateWebhook(jobData);
    return {};
  }
  async processProductCreateWebhook(data: any) {
    const dataFormWebhook = data;

    await this.entityManager.transaction(async (transaction) => {
      try {
        const store = dataFormWebhook?.vendor.toLowerCase();
        const shopifyMemberToken =
          transaction.getRepository(ShopifyMemberToken);
        const shopifyMember = await shopifyMemberToken.findOne({
          where: { shop: `${store}.myshopify.com` },
        });
        const productRepo = transaction.getRepository(Products);

        const saveProduct = await productRepo.save({
          id: dataFormWebhook.id,
          title: dataFormWebhook.title,
          description: dataFormWebhook.body_html,
          category:
            dataFormWebhook?.category?.full_name ||
            dataFormWebhook?.category?.name,
          createdAt: dataFormWebhook?.created_at,
          updatedAt: dataFormWebhook?.created_at,
          vendor: dataFormWebhook?.vendor,
          productStatus: dataFormWebhook?.status,
          pricing: Number(dataFormWebhook?.price) || 0,
          userId: shopifyMember.id,
        });

        if (!saveProduct) {
          throw new Error('Lưu sản phẩm thất bại');
        }

        if (dataFormWebhook?.variants?.length > 0) {
          let quantity = 0;
          const variantCreator = dataFormWebhook.variants.map((element) => {
            quantity = quantity + element?.inventory_quantity || 0;

            return {
              id: element?.id,
              barcode: element?.barcode || null,
              createdAt: element?.created_at,
              updatedAt: element?.created_at,
              sku: element?.sku || null,
              title: element?.title || null,
              option1: element?.option1 || null,
              option2: element?.option2 || null,
              option3: element?.option3 || null,
              pricing: Number(element?.price) || 0,
              inventoryQuantity: Number(element?.inventory_quantity),
              oldInventoryQuantity: Number(element?.old_inventory_quantity),
              productId: dataFormWebhook.id,
            };
          });

          const varRepo = transaction.getRepository(Variants);
          const saveVariants = await varRepo.save(variantCreator);

          if (!saveVariants) {
            throw new Error('Lưu biến thể sản phẩm thất bại');
          }
        }

        if (dataFormWebhook?.images?.length > 0) {
          const mediaDatas = dataFormWebhook.images.map((e) => ({
            id: e?.id,
            url: e?.src,
            productId: dataFormWebhook.id,
            createdAt: e?.created_at,
            updatedAt: e?.updated_at,
            type: MediaType.IMAGE,
          }));

          const mediaRepo = transaction.getRepository(ProductMedia);
          const saveMedia = await mediaRepo.save(mediaDatas);

          if (!saveMedia) {
            throw new Error('Lưu hình ảnh thất bại');
          }
        }

        return true; // Transaction thành công
      } catch (error) {
        console.error('Lỗi khi thực hiện transaction:', error.message);
        throw error; // Transaction sẽ rollback nếu có lỗi
      }
    });

    // if (tranResult) {
    //   await this.productFacebookService.uploadProducts(
    //     dataFormWebhook?.shopifyUser?.token,
    //     [data],
    //   );
    // }
  }
  @OnWorkerEvent('drained')
  async jobDrained(): Promise<any> {
    console.log(`RefreshTokenQueue is drained`);
  }
  @OnWorkerEvent('progress')
  async jobProgress(job: Job): Promise<any> {
    console.log(`Job is progress with id ${job.id}`);
  }
  @OnWorkerEvent('completed')
  async jobCompleted(job: Job): Promise<any> {
    console.log(`Job is completed with id ${job.id}`);
  }
  @OnWorkerEvent('failed')
  async jobFailed(job: Job, err: Error): Promise<any> {
    console.error(`❌ Job failed: ID = ${job?.id}`);
    console.error(`📌 Error Message: ${err.message}`);
    console.error(`🔍 Stack Trace:`, err.stack);
  }
}
