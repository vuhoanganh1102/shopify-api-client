import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleModule } from '@nestjs/schedule';
import { FacebookMemberTokenModule } from 'src/facebook-member-token/facebook-member-token.module';
import { QueuesModule } from '@app/queues';
import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    FacebookMemberTokenModule,
    QueuesModule,
    BullModule.registerQueue({ name: QueueChanel.REFRESH_TOKEN }),
  ],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
