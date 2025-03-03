import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
// import { ShopifyApiClientModule } from '@app/shopify-api-client';
import { MongoModule } from '@app/mongo';
import { ProductModule } from './product/product.module';
import { WebhookModule } from './webhook/webhook.module';
import { FacebookModule } from './facebook/facebook.module';
// import { FacebookModule } from '@app/facebook';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongoModule,
    ProductModule,
    WebhookModule,
    FacebookModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
