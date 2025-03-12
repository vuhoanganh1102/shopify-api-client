import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';
import { ShopifyAuthGuard } from './shopifyMember.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopifyMemberToken]),
    ConfigModule.forRoot(),
  ],
  providers: [ShopifyAuthGuard],
  exports: [ShopifyAuthGuard],
})
export class ShopifyOauthGaurdModule {}
