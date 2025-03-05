import { Module } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
