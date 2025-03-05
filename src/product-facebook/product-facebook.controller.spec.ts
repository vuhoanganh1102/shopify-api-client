import { Test, TestingModule } from '@nestjs/testing';
import { ProductFacebookController } from './product-facebook.controller';
import { ProductFacebookService } from './product-facebook.service';

describe('ProductFacebookController', () => {
  let controller: ProductFacebookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductFacebookController],
      providers: [ProductFacebookService],
    }).compile();

    controller = module.get<ProductFacebookController>(
      ProductFacebookController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
