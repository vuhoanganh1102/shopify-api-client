import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Injectable } from '@nestjs/common';
import { FacebookMemberTokenService } from 'src/facebook-member-token/facebook-member-token.service';

@Injectable()
@Processor(QueueChanel.REFRESH_TOKEN) // limited 10 jobs is run in time
export class RefreshTokenConsumer extends WorkerHost {
  constructor(
    @InjectRepository(FacebookMemberToken)
    private readonly facebookMemberToken: Repository<FacebookMemberToken>,
    private readonly facebookMemberTokenService: FacebookMemberTokenService,
  ) {
    super();
  }
  private queueNum = [];
  private ids = [];
  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job?.id}`);
    const jobData = job.data;
    // const waiting = await job.queue.getWaiting(0, 8);

    // this.queueNum.push({
    //   id: job.data.id,
    //   token: job.data.token,
    //   expiresIn: job.data.expiresIn,
    // } as RefreshTokenInterface);
    // this.ids.push(job.data.id);

    // this.facebookMemberTokenService.refreshToken(this.queueNum, this.ids);
    // this.queueNum.length = 0;
    // this.ids.length = 0;

    // oldData.forEach((e: any) => ids.push(e.id));
    await this.facebookMemberTokenService.refreshToken(jobData);
    return {};
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
