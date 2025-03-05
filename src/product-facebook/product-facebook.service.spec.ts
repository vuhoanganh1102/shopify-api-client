import { Test, TestingModule } from '@nestjs/testing';
import { ProductFacebookService } from './product-facebook.service';

describe('ProductFacebookService', () => {
  let service: ProductFacebookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductFacebookService],
    }).compile();

    service = module.get<ProductFacebookService>(ProductFacebookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
