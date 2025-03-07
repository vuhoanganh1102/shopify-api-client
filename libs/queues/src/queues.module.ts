import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { FacebookMemberTokenModule } from 'src/facebook-member-token/facebook-member-token.module';
import { RefreshTokenConsumer } from './RefreshToken.consumer';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacebookMemberToken]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({ name: QueueChanel.REFRESH_TOKEN }),
    FacebookMemberTokenModule,
  ],
  providers: [QueuesService, RefreshTokenConsumer],
  exports: [QueuesService],
})
export class QueuesModule {}
