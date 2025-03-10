import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';

import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { EntityManager } from 'typeorm';
import { Products } from '@app/mysql/entities/products.entity';
import { Variants } from '@app/mysql/entities/variants.entity';
import { ProductMedia } from '@app/mysql/entities/productMedia.entity';
import { MediaType } from '@app/helper/enum';

@Injectable()
@Processor(QueueChanel.CREATE_PRODUCT_WEBHOOK) // limited 10 jobs is run in time
export class CreateProductWebhookConsumer extends WorkerHost {
  constructor(private readonly entityManager: EntityManager) {
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

    const creatorTransaction = await this.entityManager.transaction(
      async (transaction) => {
        const productRepo = transaction.getRepository(Products);
        await productRepo.save({
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
        });
        if (dataFormWebhook?.variants?.length > 0) {
          // const variant;
          let quantity = 0;
          const variantCreator = [];
          dataFormWebhook?.variants.forEach((element) => {
            quantity = quantity + element?.inventory_quantity;

            const data = {
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
            variantCreator.push(data);
          });
          const varRepo = transaction.getRepository(Variants);
          await varRepo.save(variantCreator);
        }

        if (dataFormWebhook?.images?.length > 0) {
          const mediaDatas = [];
          dataFormWebhook?.images.forEach((e) => {
            const data = {
              id: e?.id,
              url: e?.src,
              productId: dataFormWebhook.id,
              createdAt: e?.created_at,
              updatedAt: e?.updated_at,
              type: MediaType.IMAGE,
            };
            mediaDatas.push(data);
          });
          const mediaRepo = transaction.getRepository(ProductMedia);
          await mediaRepo.save(mediaDatas);
        }

        return true;
      },
    );
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
