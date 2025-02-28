import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyApiClientService } from './shopify-api-client.service';

describe('ShopifyApiClientService', () => {
  let service: ShopifyApiClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ShopifyApiClientService],
    }).compile();

    service = module.get<ShopifyApiClientService>(ShopifyApiClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
