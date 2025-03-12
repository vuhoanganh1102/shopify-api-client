import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';

import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';
import { Products } from '@app/mysql/entities/products.entity';
import { Variants } from '@app/mysql/entities/variants.entity';
import { ProductMedia } from '@app/mysql/entities/productMedia.entity';

@Injectable()
@Processor(QueueChanel.DELETE_PRODUCT_WEBHOOK) // limited 10 jobs is run in time
export class DeleteProductWebhookConsumer extends WorkerHost {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(job);
    const jobData = job.data;
    console.log(`Processing job ${job?.id}`);
    await this.processProductDeleteWebhook(jobData);
    return {};
  }
  async processProductDeleteWebhook(data: any) {
    await this.entityManager.transaction(async (transaction) => {
      // xoa media
      const mediaRepo = transaction.getRepository(ProductMedia);
      const delDataMedia = await mediaRepo.find({
        where: { productId: data.id },
      });
      if (delDataMedia.length > 0) await mediaRepo.remove(delDataMedia);

      // xoa variants
      const variantRepo = transaction.getRepository(Variants);
      const delDataVariant = await variantRepo.find({
        where: { productId: data.id },
      });
      if (delDataVariant.length > 0) await variantRepo.remove(delDataVariant);

      // xoa san pham
      const productRepo = transaction.getRepository(Products);
      await productRepo.delete(data.id);

      return true;
    });
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
