import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { FacebookMemberTokenModule } from 'src/facebook-member-token/facebook-member-token.module';

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
    FacebookMemberTokenModule,
  ],
  providers: [QueuesService],
  exports: [QueuesService],
})
export class QueuesModule {}
