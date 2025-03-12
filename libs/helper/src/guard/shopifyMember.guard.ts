import { ShopifyMemberToken } from '@app/mysql/entities/shopifyMemberToken.enity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ShopifyAuthGuard implements CanActivate {
  constructor(
    @InjectRepository(ShopifyMemberToken)
    private readonly shopifyMemberTokenRepo: Repository<ShopifyMemberToken>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const shop = request.query.shop as string;
    console.log('shop', shop);
    if (!shop) return false;

    const user = await this.shopifyMemberTokenRepo.findOne({ where: { shop } });
    console.log('checkuser', user);
    if (user) {
      request['shopifyUser'] = user;
      return true;
    }
    return false;
  }
}
