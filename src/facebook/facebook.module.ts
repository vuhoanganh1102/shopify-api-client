import { Module } from '@nestjs/common';
import FacebookController from './facebook.controller';
import { FacebookService } from './facebook.service';

@Module({
  imports: [],
  controllers: [FacebookController],
  providers: [FacebookService],
  exports: [FacebookService],
})
export class FacebookModule {}
