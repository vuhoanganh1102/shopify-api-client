import { Module } from '@nestjs/common';
import { FacebookMemberTokenService } from './facebook-member-token.service';
import { FacebookMemberTokenController } from './facebook-member-token.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacebookMemberToken } from '@app/mysql/entities/facebookMemberToken.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacebookMemberToken])],
  controllers: [FacebookMemberTokenController],
  providers: [FacebookMemberTokenService],
})
export class FacebookMemberTokenModule {}
