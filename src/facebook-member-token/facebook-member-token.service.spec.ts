import { Test, TestingModule } from '@nestjs/testing';
import { FacebookMemberTokenService } from './facebook-member-token.service';

describe('FacebookMemberTokenService', () => {
  let service: FacebookMemberTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FacebookMemberTokenService],
    }).compile();

    service = module.get<FacebookMemberTokenService>(FacebookMemberTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
