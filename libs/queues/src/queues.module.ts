import { Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { BullModule } from '@nestjs/bullmq';
import { QueueChanel } from '@app/helper/enum/queueChanel';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { FacebookMemberTokenModule } from 'src/facebook-member-token/facebook-member-token.module';
import { RefreshTokenConsumer } from './RefreshToken.consumer';
import { CreateProductWebhookConsumer } from './CreateProductWebhook.consumer';
import { DeleteProductWebhookConsumer } from './DeleteProductWebhook.consumer';
import { ProductFacebookModule } from 'src/product-facebook/product-facebook.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacebookMemberToken]),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue(
      { name: QueueChanel.REFRESH_TOKEN },
      { name: QueueChanel.CREATE_PRODUCT_WEBHOOK },
      { name: QueueChanel.DELETE_PRODUCT_WEBHOOK },
    ),

    FacebookMemberTokenModule,
    ProductFacebookModule,
  ],
  providers: [
    QueuesService,
    RefreshTokenConsumer,
    CreateProductWebhookConsumer,
    DeleteProductWebhookConsumer,
  ],
  exports: [QueuesService],
})
export class QueuesModule {}
