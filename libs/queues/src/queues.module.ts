import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacebookMemberToken]),
    BullModule.registerQueue({
      name: QueueChanel.REFRESH_TOKEN,
      connection: {
        host: 'localhost',
        port: 6379,
      },

      // removeOnFail: { count: 0 },
    }),
  ],
  providers: [QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
