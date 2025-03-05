import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedulesService {
  @Cron('24 * * * *', {
    name: 'refreshTokenCron',
    timeZone: 'Europe/Paris',
  })
  async refreshToken() {}
}
