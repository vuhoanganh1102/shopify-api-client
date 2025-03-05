import { Module } from '@nestjs/common';
import FacebookController from './facebook.controller';
import { FacebookService } from './facebook.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserToken, UserTokenSchema } from '@app/mongo/schema/UserToken.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
  ],
  controllers: [FacebookController],
  providers: [FacebookService],
  exports: [FacebookService],
})
export class FacebookModule {}
