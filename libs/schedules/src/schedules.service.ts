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
  constructor(
    private readonly facebookMemberTokenService: FacebookMemberTokenService,
    @InjectQueue(QueueChanel.REFRESH_TOKEN)
    private readonly refreshTokenQueue: Queue,
  ) {}
  @Cron('2 * * * * * *', {
    name: ScheduleName.REFRESH_TOKEN_CRON,
    timeZone: TimeZone.EUROPE_PARIS,
  })
  async refreshToken() {
    console.log(`Task schedule ${ScheduleName.REFRESH_TOKEN_CRON} started.`);
    const data = await this.facebookMemberTokenService.getItemsToExpire();

    let count = 0;
    const dataBulkQueue = [];
    for (let i = 0; i < data.length; i++) {
      count = count + 1;
      dataBulkQueue.push(data[i]);
      if (count === 10) {
        await this.refreshTokenQueue.addBulk(dataBulkQueue);
        count = 0;
        dataBulkQueue.length = 0;
      }
    }
  }
}
