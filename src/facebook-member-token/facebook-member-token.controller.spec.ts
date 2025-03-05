import { Test, TestingModule } from '@nestjs/testing';
import { FacebookMemberTokenController } from './facebook-member-token.controller';
import { FacebookMemberTokenService } from './facebook-member-token.service';

describe('FacebookMemberTokenController', () => {
  let controller: FacebookMemberTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FacebookMemberTokenController],
      providers: [FacebookMemberTokenService],
    }).compile();

    controller = module.get<FacebookMemberTokenController>(FacebookMemberTokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
