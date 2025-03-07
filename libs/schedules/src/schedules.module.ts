import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FacebookMemberTokenModule } from 'src/facebook-member-token/facebook-member-token.module';

import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { QueuesModule } from '@app/queues';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FacebookMemberTokenModule,
    QueuesModule,
    BullModule.registerQueue({
      name: QueueChanel.REFRESH_TOKEN, // Tên queue
    }),
  ],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
