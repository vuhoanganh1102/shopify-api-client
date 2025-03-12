import { Module } from '@nestjs/common';
import { FacebookMemberTokenService } from './facebook-member-token.service';
import { FacebookMemberTokenController } from './facebook-member-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';
import { FacebookModule } from 'src/facebook/facebook.module';
import { ShopifyOauthGaurdModule } from '@app/helper/guard/guard.module';
import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FacebookMemberToken, ShopifyMemberToken]),
    FacebookModule,
    ShopifyOauthGaurdModule,
  ],
  controllers: [FacebookMemberTokenController],
  providers: [FacebookMemberTokenService],
  exports: [FacebookMemberTokenService],
})
export class FacebookMemberTokenModule {}
