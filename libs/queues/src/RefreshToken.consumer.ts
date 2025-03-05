import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Injectable } from '@nestjs/common';
@Injectable()
@Processor(QueueChanel.REFRESH_TOKEN, { concurrency: 10 }) // limited 10 jobs is run in time
export class RefreshTokenConsumer extends WorkerHost {
  constructor(
    @InjectRepository(FacebookMemberToken)
    private readonly facebookMemberToken: Repository<FacebookMemberToken>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job.id}`);
    const oldData = job.data;

    oldData.forEach((e: any) => {
      const entity = e.data;
      entity['expires_in'] += 30 * 24 * 60 * 60;
    });

    return {};
  }

  // func update data
  async batchUpdate() {
    if (batch.length === 0) return; // Không có job nào cần update

    console.log(`Batch updating ${batch.length} jobs into MySQL...`);

    // Tạo câu lệnh UPDATE nhiều dòng bằng CASE WHEN
    const updates = batch
      .map((job) => `WHEN id = ${job.id} THEN '${job.value}'`)
      .join(' ');

    const ids = batch.map((job) => job.id).join(',');

    const sql = `
      UPDATE users
      SET value = CASE ${updates} END
      WHERE id IN (${ids})
    `;

    // const conn = await pool.getConnection();

    // try {
    //   await conn.execute(sql);
    //   console.log(`Batch updated ${batch.length} jobs`);
    // } catch (error) {
    //   console.error(`Batch update failed:`, error);
    // } finally {
    //   conn.release();
    // }

    // Xóa batch sau khi cập nhật xong
    batch.length = 0;
  }
  @OnWorkerEvent('completed')
  async jobCompleted(job: Job): Promise<any> {
    console.log(`Job is completed with id ${job.id}`);
  }

  @OnWorkerEvent('failed')
  async jobFailed(): Promise<any> {
    console.log(`Jobs is failed`);
  }
}
