import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyOauthService } from './shopify-oauth.service';

describe('ShopifyOauthService', () => {
  let service: ShopifyOauthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopifyOauthService],
    }).compile();

    service = module.get<ShopifyOauthService>(ShopifyOauthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
