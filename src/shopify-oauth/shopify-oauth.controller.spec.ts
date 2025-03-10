import { Test, TestingModule } from '@nestjs/testing';
import { ShopifyOauthController } from './shopify-oauth.controller';
import { ShopifyOauthService } from './shopify-oauth.service';

describe('ShopifyOauthController', () => {
  let controller: ShopifyOauthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopifyOauthController],
      providers: [ShopifyOauthService],
    }).compile();

    controller = module.get<ShopifyOauthController>(ShopifyOauthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
