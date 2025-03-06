import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { Injectable } from '@nestjs/common';
import { FacebookMemberTokenService } from 'src/facebook-member-token/facebook-member-token.service';
@Injectable()
@Processor(QueueChanel.REFRESH_TOKEN, { concurrency: 10 }) // limited 10 jobs is run in time
export class RefreshTokenConsumer extends WorkerHost {
  constructor(
    @InjectRepository(FacebookMemberToken)
    private readonly facebookMemberToken: Repository<FacebookMemberToken>,
    private readonly facebookMemberTokenService: FacebookMemberTokenService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job.id}`);
    const oldData = job.data;
    const ids = [];
    oldData.foreach((e: any) => ids.push(e.id));
    this.facebookMemberTokenService.refreshToken(oldData, ids);
    return {};
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
