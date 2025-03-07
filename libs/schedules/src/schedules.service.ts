import { QueueChanel } from '@app/helper/enum/queueChanel';
import { ScheduleName } from '@app/helper/enum/scheduleName';
import { TimeZone } from '@app/helper/enum/timeZone';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Queue } from 'bullmq';
import { FacebookMemberTokenService } from 'src/facebook-member-token/facebook-member-token.service';

@Injectable()
export class SchedulesService {
  private COUNT_ITEM_TOKEN = Number(process.env.COUNT_ITEM_TOKEN);
  constructor(
    private readonly facebookMemberTokenService: FacebookMemberTokenService,
    @InjectQueue(QueueChanel.REFRESH_TOKEN)
    private readonly refreshTokenQueue: Queue,
  ) {}
  @Cron('24 * * *', {
    name: ScheduleName.REFRESH_TOKEN_CRON,
    timeZone: TimeZone.EUROPE_PARIS,
  })
  async refreshToken() {
    console.log(`Task schedule ${ScheduleName.REFRESH_TOKEN_CRON} started.`);
    // await this.refreshTokenQueue.add('test_job', { data: 'test' });
    const data = await this.facebookMemberTokenService.getItemsToExpire();

    let count = 0;
    const dataBulkQueue = [];
    for (let i = 0; i < data.length; i++) {
      count = count + 1;
      dataBulkQueue.push({
        name: `${ScheduleName.REFRESH_TOKEN_CRON}:${data[i].id}`,
        data: data[i],
        opts: {
          removeOnComplete: true, // Xóa job khỏi Redis sau khi hoàn thành
          removeOnFail: true, // Xóa job khỏi Redis nếu thất bại,
        },
      });
      if (count === this.COUNT_ITEM_TOKEN) {
        await this.refreshTokenQueue.addBulk(dataBulkQueue);
        count = 0;
        dataBulkQueue.length = 0;
      }
      if (count < this.COUNT_ITEM_TOKEN && i === data.length - 1) {
        await this.refreshTokenQueue.addBulk(dataBulkQueue);
        count = 0;
        dataBulkQueue.length = 0;
      }
    }
    console.log(`${ScheduleName.REFRESH_TOKEN_CRON} finish job.`);
    return {};
  }
}
