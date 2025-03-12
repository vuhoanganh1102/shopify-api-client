import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { ShopifyApiClientModule } from '@app/shopify-api-client';
import { MongoModule } from '@app/mongo';
import { ProductModule } from './product/product.module';
import { WebhookModule } from './webhook/webhook.module';
import { FacebookModule } from './facebook/facebook.module';
// import { FacebookModule } from '@app/facebook';
import { ProductFacebookModule } from './product-facebook/product-facebook.module';

import { SchedulesModule } from '@app/schedules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from '@app/mysql/dataSource';
import { configDb } from './config/configuration';
import { FacebookMemberTokenModule } from './facebook-member-token/facebook-member-token.module';
import { QueuesModule } from '@app/queues';
import { ShopifyOauthModule } from './shopify-oauth/shopify-oauth.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<configDb, true>) => ({
        ...configService.get('TypeOrmModuleOptions'),
      }),
      dataSourceFactory: async () => {
        return await dataSource.initialize();
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    MongoModule,
    ProductModule,
    WebhookModule,
    FacebookModule,
    ProductFacebookModule,
    SchedulesModule,
    FacebookMemberTokenModule,
    QueuesModule,
    ShopifyOauthModule,
    // QueuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
